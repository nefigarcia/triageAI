
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

    const companyId = "comp-acme"

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
            status: "open",
            assignedTo: assignedTo ? { connect: { id: assignedTo.id } } : undefined,
            team: assignedTeam ? { connect: { id: assignedTeam.id } } : undefined,
            logs: {
                create: [
                    {
                        timestamp: new Date(),
                        actor: 'AI',
                        actorName: 'TriageAI',
                        action: 'Ticket Created',
                        details: 'Received from web form.'
                    },
                    {
                        timestamp: new Date(),
                        actor: 'AI',
                        actorName: 'TriageAI',
                        action: 'Intent Analysis',
                        details: `Intent: ${intentAnalysis.intent}, Urgency: ${intentAnalysis.urgency}, Category: ${intentAnalysis.category}`
                    },
                    {
                        timestamp: new Date(),
                        actor: 'AI',
                        actorName: 'TriageAI',
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

const signupSchema = z.object({
  companyName: z.string().min(1, "Company name is required."),
  name: z.string().min(1, "Your name is required."),
  email: z.string().email("Invalid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  planId: z.string().min(1, "Plan selection is required."),
})

export async function signupAction(data: z.infer<typeof signupSchema>) {
    const validation = signupSchema.safeParse(data);
    if (!validation.success) {
        return { errors: validation.error.flatten().fieldErrors };
    }
    
    // In a real app, you would hash the password here. e.g., using bcrypt
    // const hashedPassword = await bcrypt.hash(data.password, 10);

    try {
        const company = await prisma.company.create({
            data: {
                name: data.companyName,
                plan: { connect: { id: data.planId } },
                users: {
                    create: [
                        {
                            name: data.name,
                            email: data.email,
                            password: data.password, // Storing plaintext for simplicity
                        }
                    ]
                }
            }
        });
        
        revalidatePath("/dashboard/analytics");
        return { success: true, companyId: company.id };

    } catch (error: any) {
        console.error("Signup failed:", error);
        // Check for unique constraint violation for email
        if (error?.code === 'P2002' && error?.meta?.target?.includes('email')) {
             return { errors: { email: ["An account with this email already exists."] } };
        }
        return { errors: { _form: ["An unexpected error occurred. Please try again."] } };
    }
}
