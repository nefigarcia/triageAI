
"use client"

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const features = [
    "Intelligent ticket analysis",
    "Automated ticket routing",
    "Agent decision logging",
    "Real-time escalation alerts",
    "Human-in-the-loop override"
]

export default function Home() {
  return (
    <div className="relative w-full min-h-screen bg-gray-900 text-white overflow-hidden">
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black" />
      
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center h-full text-center lg:text-left px-4 pt-20 pb-10 lg:py-0">
        
        <div className="lg:w-1/2 lg:pr-10">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-orange-300">
              TriageAI
            </h1>
            <p className="mt-4 text-lg md:text-xl max-w-2xl text-gray-300 mx-auto lg:mx-0">
              The smart way to handle customer support. Our AI analyzes, categorizes, and routes support tickets automatically, so your team can focus on what matters most: solving problems.
            </p>
            <ul className="mt-6 space-y-2 text-left inline-block mx-auto lg:mx-0">
                {features.map(feature => (
                    <li key={feature} className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-primary" />
                        <span className="text-gray-300">{feature}</span>
                    </li>
                ))}
            </ul>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button asChild size="lg">
                <Link href="/signup">Start Free Trial</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-transparent border-primary/50 hover:bg-primary/10"
              >
                <Link href="/dashboard">Agent Dashboard</Link>
              </Button>
            </div>
        </div>
        
        <div className="w-full lg:w-1/2 mt-10 lg:mt-0 flex items-center justify-center p-8">
            <div 
              className="w-[400px] h-[400px] bg-gradient-to-br from-blue-400/20 to-orange-400/20 rounded-full animate-[spin_20s_linear_infinite]"
              data-ai-hint="abstract geometric background"
            >
              <div className="w-full h-full bg-gradient-to-tr from-blue-400/30 to-orange-400/30 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
            </div>
        </div>

      </div>
    </div>
  );
}
