'use server';

/**
 * @fileOverview This file defines a Genkit flow for routing support tickets to the appropriate agent or team based on the intent analysis.
 *
 * - routeTicket - A function that routes the ticket.
 * - RouteTicketInput - The input type for the routeTicket function.
 * - RouteTicketOutput - The return type for the routeTicket function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RouteTicketInputSchema = z.object({
  ticketContent: z.string().describe('The content of the support ticket.'),
  ticketCategory: z.string().describe('The category of the support ticket.'),
  ticketIntent: z.string().describe('The intent of the support ticket.'),
  ticketUrgency: z.enum(['low', 'medium', 'high']).describe('The urgency level of the ticket.'),
});
export type RouteTicketInput = z.infer<typeof RouteTicketInputSchema>;

const RouteTicketOutputSchema = z.object({
  assignedAgent: z.string().describe('The ID of the agent to whom the ticket is assigned.'),
  assignedTeam: z.string().describe('The ID of the team to which the ticket is assigned.'),
  autoResponse: z.string().optional().describe('The auto-response sent to the user, if any.'),
  shouldEscalate: z.boolean().describe('Whether the ticket should be escalated.'),
});
export type RouteTicketOutput = z.infer<typeof RouteTicketOutputSchema>;

export async function routeTicket(input: RouteTicketInput): Promise<RouteTicketOutput> {
  return routeTicketFlow(input);
}

const routeTicketPrompt = ai.definePrompt({
  name: 'routeTicketPrompt',
  input: {schema: RouteTicketInputSchema},
  output: {schema: RouteTicketOutputSchema},
  prompt: `You are an expert support ticket routing agent. Your goal is to analyze incoming support tickets and automatically route them to the appropriate agent or team.

Analyze the following support ticket:

Category: {{{ticketCategory}}}
Content: {{{ticketContent}}}
Intent: {{{ticketIntent}}}
Urgency: {{{ticketUrgency}}}

Based on the category, content, intent, and urgency, determine the following:

- assignedAgent: The ID of the most suitable agent to handle the ticket.
- assignedTeam: The ID of the team to which the agent belongs.
- autoResponse: A brief auto-response to acknowledge receipt of the ticket, if appropriate. If not appropriate, leave blank.
- shouldEscalate: Whether the ticket should be escalated to a higher level of support.

Respond in the following JSON format:
{
  "assignedAgent": "",
  "assignedTeam": "",
  "autoResponse": "",
  "shouldEscalate": false
}

Ensure that the assignedAgent and assignedTeam correspond to valid, existing support agents and teams within the organization.
`,
});

const routeTicketFlow = ai.defineFlow(
  {
    name: 'routeTicketFlow',
    inputSchema: RouteTicketInputSchema,
    outputSchema: RouteTicketOutputSchema,
  },
  async input => {
    const {output} = await routeTicketPrompt(input);
    return output!;
  }
);
