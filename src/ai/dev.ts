import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-ticket-intent.ts';
import '@/ai/flows/automatically-route-ticket.ts';
import '@/ai/flows/suggest-response.ts';
import '@/ai/flows/route-ticket.ts';