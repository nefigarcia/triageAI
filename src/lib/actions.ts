"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { analyzeTicketIntent } from "@/ai/flows/analyze-ticket-intent"
import { automaticallyRouteTicket } from "@/ai/flows/automatically-route-ticket"
import { suggestResponse } from "@/ai/flows/suggest-response"

const newTicketSchema = z.object({
  subject: z.string().min(1, "Subject is required."),
  description: z.string().min(1, "Description is required."),
  customerName: z.string().min(1, "Customer name is required."),
  customerEmail: z.string().email("Invalid email address."),
})

export async function createTicketAction(formData: FormData) {
  const rawFormData = Object.fromEntries(formData.entries())
  const validation = newTicketSchema.safeParse(rawFormData)

  if (!validation.success) {
    return {
      errors: validation.error.flatten().fieldErrors,
    }
  }

  const ticketText = `Subject: ${validation.data.subject}\n\n${validation.data.description}`

  try {
    const intentAnalysis = await analyzeTicketIntent({ ticketText })
    console.log("Intent Analysis:", intentAnalysis)

    const routingDecision = await automaticallyRouteTicket({
      ticketContent: ticketText,
      ticketCategory: intentAnalysis.category,
    })
    console.log("Routing Decision:", routingDecision)

    // Here you would typically save the new ticket and its AI-generated properties to your database.
    // For this example, we'll just log it and revalidate the path to simulate a refresh.

    console.log("New ticket created and triaged:", {
      ...validation.data,
      ...intentAnalysis,
      ...routingDecision,
    })

    revalidatePath("/dashboard")

    return {
      success: true,
      message: "Ticket created and triaged successfully!",
    }
  } catch (error) {
    console.error("AI processing failed:", error)
    return {
      errors: {
        _form: ["AI processing failed. Please try again later."],
      },
    }
  }
}

export async function suggestReplyAction(ticketContent: string) {
    if (!ticketContent) {
        return { error: "Ticket content is required." }
    }

    try {
        const result = await suggestResponse({ ticketContent });
        return { suggestedResponse: result.suggestedResponse }
    } catch (error) {
        console.error("Failed to suggest reply:", error);
        return { error: "Could not generate a suggested reply." }
    }
}
