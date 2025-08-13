'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SceneWrapper } from '@/components/scene-wrapper';

export default function Home() {
  return (
    <div className="relative w-full h-screen bg-gray-900 text-white">
      <div className="absolute inset-0 z-0">
        <SceneWrapper />
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-orange-300">
          TriageFlow
        </h1>
        <p className="mt-4 text-lg md:text-xl max-w-2xl text-gray-300">
          Intelligent ticket analysis and automated routing to streamline your
          customer support.
        </p>
        <div className="mt-8 flex gap-4">
          <Button asChild size="lg">
            <Link href="/dashboard">Agent Dashboard</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="bg-transparent border-primary/50 hover:bg-primary/10"
          >
            <Link href="/login">Customer Login</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
