"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const plans = [
  {
    id: 'plan-starter',
    name: 'Starter',
    price: '$49',
    period: '/month',
    description: 'For small teams getting started.',
    features: ['500 tasks', '1 agent', 'Basic analytics'],
  },
  {
    id: 'plan-pro',
    name: 'Pro',
    price: '$199',
    period: '/month',
    description: 'For growing teams that need more power.',
    features: ['5,000 tasks', '5 agents', 'Team dashboard'],
    recommended: true,
  },
  {
    id: 'plan-enterprise',
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large organizations with specific needs.',
    features: ['Unlimited tasks', 'SLAs', 'Dedicated support'],
  },
];

export default function PlanSelectionPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>('plan-pro');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectPlan = async () => {
    if (!selectedPlanId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a plan to continue.",
      });
      return;
    }

    setIsSubmitting(true);
    // Redirect to the next step of the signup process
    router.push(`/signup/register?planId=${selectedPlanId}`);
    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Choose Your Plan</h1>
          <p className="mt-2 text-lg text-muted-foreground">Select the plan that best fits your team's needs.</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={cn(
                "flex flex-col cursor-pointer transition-all",
                selectedPlanId === plan.id ? "border-primary ring-2 ring-primary" : "border-border",
                plan.recommended && "border-primary"
              )}
              onClick={() => setSelectedPlanId(plan.id)}
            >
              {plan.recommended && (
                <div className="py-1 px-4 bg-primary text-primary-foreground text-center text-sm font-semibold rounded-t-lg">
                  Recommended
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-6">
                <div>
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                 <Button 
                    className="w-full"
                    variant={selectedPlanId === plan.id ? 'default' : 'outline'}
                 >
                    {selectedPlanId === plan.id ? 'Selected' : 'Select Plan'}
                 </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
            <Button size="lg" onClick={handleSelectPlan} disabled={!selectedPlanId || isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Continue
            </Button>
        </div>
      </div>
    </div>
  );
}
