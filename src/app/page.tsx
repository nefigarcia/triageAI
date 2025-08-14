
"use client"

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, Bot, GitBranch, ShieldCheck } from 'lucide-react';

const features = [
    {
        icon: <Bot className="h-8 w-8 text-primary" />,
        title: "Intelligent Ticket Analysis",
        description: "Our AI automatically analyzes ticket content to determine intent, urgency, and category."
    },
    {
        icon: <GitBranch className="h-8 w-8 text-primary" />,
        title: "Automated Ticket Routing",
        description: "Route tickets to the right agent or team instantly based on your configured workflows."
    },
    {
        icon: <ShieldCheck className="h-8 w-8 text-primary" />,
        title: "Human-in-the-Loop",
        description: "Maintain full control with easy overrides and a complete audit trail of all AI actions."
    }
]

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
            <div className="mr-4 flex items-center">
                <Bot className="h-6 w-6 mr-2" />
                <span className="font-bold">TriageAI</span>
            </div>
            <div className="flex flex-1 items-center justify-end space-x-4">
                <nav className="flex items-center space-x-2">
                    <Button variant="ghost" asChild>
                        <Link href="/login">Log In</Link>
                    </Button>
                    <Button asChild>
                        <Link href="/signup">Start Free Trial</Link>
                    </Button>
                </nav>
            </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 sm:py-32">
            <div className="container px-4 text-center">
                <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                    Automate Your Support Queue with AI
                </h1>
                <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
                    TriageAI analyzes, categorizes, and routes support tickets automatically, so your team can focus on what matters most: solving problems.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                    <Button size="lg" asChild>
                        <Link href="/signup">
                            Get Started <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                        <Link href="/dashboard">View Dashboard</Link>
                    </Button>
                </div>
                 <div className="mt-16 flow-root">
                    <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                      <Image
                        src="https://placehold.co/2432x1442.png"
                        alt="App screenshot"
                        width={2432}
                        height={1442}
                        data-ai-hint="application dashboard"
                        className="rounded-md shadow-2xl ring-1 ring-gray-900/10"
                      />
                    </div>
                  </div>
            </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 sm:py-32 bg-secondary">
            <div className="container px-4">
                <div className="mx-auto max-w-2xl lg:text-center">
                    <p className="text-base font-semibold leading-7 text-primary">Key Features</p>
                    <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Everything you need to supercharge your support team</h2>
                    <p className="mt-6 text-lg leading-8 text-muted-foreground">
                        Stop wasting time on manual triage. Let our AI do the heavy lifting so your agents can be heroes.
                    </p>
                </div>
                <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                    <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                        {features.map((feature) => (
                            <div key={feature.title} className="flex flex-col">
                                <dt className="flex items-center gap-x-3 text-xl font-semibold leading-7">
                                    {feature.icon}
                                    {feature.title}
                                </dt>
                                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                                    <p className="flex-auto">{feature.description}</p>
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 sm:py-32">
            <div className="container px-4 text-center">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    Ready to get started?
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                    Sign up for a free trial today. No credit card required.
                </p>
                <div className="mt-8">
                    <Button size="lg" asChild>
                        <Link href="/signup">Start your 14-day free trial</Link>
                    </Button>
                </div>
            </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
            <p className="text-sm text-muted-foreground">&copy; 2024 TriageAI. All rights reserved.</p>
            <div className="flex items-center gap-4">
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary">Terms of Service</Link>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary">Privacy Policy</Link>
            </div>
        </div>
      </footer>
    </div>
  );
}
