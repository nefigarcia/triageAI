'use server';

/**
 * @fileOverview This file defines a Genkit flow for automatically routing support tickets to the appropriate agent or team based on the ticket's content and category.
 *
 * - automaticallyRouteTicket - A function that handles the ticket routing process.
 * - AutomaticallyRouteTicketInput - The input type for the automaticallyRouteTicket function.
 * - AutomaticallyRouteTicketOutput - The return type for the automaticallyRouteTicket function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AutomaticallyRouteTicketInputSchema = z.object({
  ticketContent: z.string().describe('The content of the support ticket.'),
  ticketCategory: z.string().describe('The category of the support ticket.'),
});
export type AutomaticallyRouteTicketInput = z.infer<typeof AutomaticallyRouteTicketInputSchema>;

const AutomaticallyRouteTicketOutputSchema = z.object({
  assignedAgent: z.string().describe('The ID of the agent to whom the ticket is assigned.'),
  assignedTeam: z.string().describe('The ID of the team to which the ticket is assigned.'),
  urgencyLevel: z.enum(['low', 'medium', 'high']).describe('The urgency level of the ticket.'),
  autoResponse: z.string().optional().describe('The auto-response sent to the user, if any.'),
  shouldEscalate: z.boolean().describe('Whether the ticket should be escalated.'),
});
export type AutomaticallyRouteTicketOutput = z.infer<typeof AutomaticallyRouteTicketOutputSchema>;

export async function automaticallyRouteTicket(input: AutomaticallyRouteTicketInput): Promise<AutomaticallyRouteTicketOutput> {
  return automaticallyRouteTicketFlow(input);
}

const automaticallyRouteTicketPrompt = ai.definePrompt({
  name: 'automaticallyRouteTicketPrompt',
  input: {schema: AutomaticallyRouteTicketInputSchema},
  output: {schema: AutomaticallyRouteTicketOutputSchema},
  prompt: `You are an expert support ticket routing agent. Your goal is to analyze incoming support tickets and automatically route them to the appropriate agent or team.

Analyze the following support ticket:

Category: {{{ticketCategory}}}
Content: {{{ticketContent}}}

Based on the category and content, determine the following:

- assignedAgent: The ID of the most suitable agent to handle the ticket.
- assignedTeam: The ID of the team to which the agent belongs.
- urgencyLevel: The urgency level of the ticket (low, medium, or high).
- autoResponse: A brief auto-response to acknowledge receipt of the ticket, if appropriate. If not appropriate, leave blank.
- shouldEscalate: Whether the ticket should be escalated to a higher level of support.

Respond in the following JSON format:
{
  "assignedAgent": "",
  "assignedTeam": "",
  "urgencyLevel": "",
  "autoResponse": "",
  "shouldEscalate": false
}

Ensure that the assignedAgent and assignedTeam correspond to valid, existing support agents and teams within the organization.
`,
});

const automaticallyRouteTicketFlow = ai.defineFlow(
  {
    name: 'automaticallyRouteTicketFlow',
    inputSchema: AutomaticallyRouteTicketInputSchema,
    outputSchema: AutomaticallyRouteTicketOutputSchema,
  },
  async input => {
    const {output} = await automaticallyRouteTicketPrompt(input);
    return output!;
  }
);
