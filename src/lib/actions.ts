"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { analyzeTicketIntent } from "@/ai/flows/analyze-ticket-intent"
import { automaticallyRouteTicket } from "@/ai/flows/automatically-route-ticket"
import { suggestResponse } from "@/ai/flows/suggest-response"
import prisma from "@/lib/db"

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

    // For now, we'll assign to a default company. In a real multi-tenant app,
    // this would come from the authenticated user's session.
    const companyId = "comp-acme"

    // Find agent and team from the database
    const assignedTo = await prisma.user.findFirst({ where: { name: routingDecision.assignedAgent, companyId: companyId } });
    const assignedTeam = await prisma.team.findFirst({ where: { name: routingDecision.assignedTeam, companyId: companyId } });

    const newTicket = await prisma.ticket.create({
        data: {
            subject: validation.data.subject,
            description: validation.data.description,
            customerName: validation.data.customerName,
            customerEmail: validation.data.customerEmail,
            company: { connect: { id: companyId } },
            category: intentAnalysis.category,
            urgency: intentAnalysis.urgency,
            status: "open", // Initial status
            assignedTo: assignedTo ? { connect: { id: assignedTo.id } } : undefined,
            team: assignedTeam ? { connect: { id: assignedTeam.id } } : undefined,
            logs: {
                create: [
                    {
                        timestamp: new Date(),
                        actor: 'AI',
                        actorName: 'TriageFlow AI',
                        action: 'Ticket Created',
                        details: 'Received from web form.'
                    },
                    {
                        timestamp: new Date(),
                        actor: 'AI',
                        actorName: 'TriageFlow AI',
                        action: 'Intent Analysis',
                        details: `Intent: ${intentAnalysis.intent}, Urgency: ${intentAnalysis.urgency}, Category: ${intentAnalysis.category}`
                    },
                    {
                        timestamp: new Date(),
                        actor: 'AI',
                        actorName: 'TriageFlow AI',
                        action: 'Route Ticket',
                        details: `Assigned to ${routingDecision.assignedAgent} in team ${routingDecision.assignedTeam}. Urgency: ${routingDecision.urgencyLevel}. Escalation: ${routingDecision.shouldEscalate}`
                    }
                ]
            }
        },
        include: {
            logs: true,
        }
    })

    console.log("New ticket created in database:", newTicket);

    revalidatePath("/dashboard")

    return {
      success: true,
      message: "Ticket created and triaged successfully!",
    }
  } catch (error) {
    console.error("AI or DB processing failed:", error)
    return {
      errors: {
        _form: ["Processing failed. Please try again later."],
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
