'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing the intent and urgency of support tickets.
 *
 * analyzeTicketIntent - A function that analyzes the intent and urgency of a support ticket.
 * AnalyzeTicketIntentInput - The input type for the analyzeTicketIntent function.
 * AnalyzeTicketIntentOutput - The return type for the analyzeTicketIntent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeTicketIntentInputSchema = z.object({
  ticketText: z.string().describe('The text content of the support ticket.'),
});
export type AnalyzeTicketIntentInput = z.infer<typeof AnalyzeTicketIntentInputSchema>;

const AnalyzeTicketIntentOutputSchema = z.object({
  intent: z.string().describe('The identified intent of the ticket (e.g., bug report, feature request, billing issue).'),
  urgency: z.enum(['high', 'medium', 'low']).describe('The urgency level of the ticket.'),
  category: z.string().describe('The category of the ticket (e.g., technical, sales, support).'),
});
export type AnalyzeTicketIntentOutput = z.infer<typeof AnalyzeTicketIntentOutputSchema>;

export async function analyzeTicketIntent(input: AnalyzeTicketIntentInput): Promise<AnalyzeTicketIntentOutput> {
  return analyzeTicketIntentFlow(input);
}

const analyzeTicketIntentPrompt = ai.definePrompt({
  name: 'analyzeTicketIntentPrompt',
  input: {schema: AnalyzeTicketIntentInputSchema},
  output: {schema: AnalyzeTicketIntentOutputSchema},
  prompt: `You are an AI expert in customer support ticket analysis. Your job is to analyze the intent, urgency, and category of incoming support tickets.\n\n  Analyze the following ticket text:\n  {{ticketText}}\n\n  Determine the intent, urgency, and category of the ticket. Urgency should be chosen from \"high\", \"medium\", and \"low\". Return the result in JSON format.\n  Intent:\n  Urgency:\n  Category:`,
});

const analyzeTicketIntentFlow = ai.defineFlow(
  {
    name: 'analyzeTicketIntentFlow',
    inputSchema: AnalyzeTicketIntentInputSchema,
    outputSchema: AnalyzeTicketIntentOutputSchema,
  },
  async input => {
    const {output} = await analyzeTicketIntentPrompt(input);
    return output!;
  }
);
