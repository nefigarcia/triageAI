// use server'
'use server';
/**
 * @fileOverview An AI agent that suggests responses to customer inquiries.
 *
 * - suggestResponse - A function that suggests a response based on the ticket content.
 * - SuggestResponseInput - The input type for the suggestResponse function.
 * - SuggestResponseOutput - The return type for the suggestResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestResponseInputSchema = z.object({
  ticketContent: z
    .string()
    .describe('The content of the support ticket, including the customer inquiry and any previous agent responses.'),
});
export type SuggestResponseInput = z.infer<typeof SuggestResponseInputSchema>;

const SuggestResponseOutputSchema = z.object({
  suggestedResponse: z
    .string()
    .describe('An AI-generated suggested response to the customer inquiry.'),
});
export type SuggestResponseOutput = z.infer<typeof SuggestResponseOutputSchema>;

export async function suggestResponse(input: SuggestResponseInput): Promise<SuggestResponseOutput> {
  return suggestResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestResponsePrompt',
  input: {schema: SuggestResponseInputSchema},
  output: {schema: SuggestResponseOutputSchema},
  prompt: `You are an AI assistant helping support agents respond to customer inquiries.

  Given the following support ticket content, generate a suggested response that is helpful, polite, and addresses the customer's issue.

  Ticket Content:
  {{ticketContent}}
  `,
});

const suggestResponseFlow = ai.defineFlow(
  {
    name: 'suggestResponseFlow',
    inputSchema: SuggestResponseInputSchema,
    outputSchema: SuggestResponseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

