"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatRelativeTime } from "@/lib/utils"
import { Bot, User, Computer, BadgeInfo, Workflow, ShieldAlert, CircleCheck, CircleX } from "lucide-react"

const iconMap: Record<string, React.ComponentType<any>> = {
    user: User,
    customer: User,
    ai: Bot,
    system: Computer,
    ticket_created_start: Workflow,
    ai_analysis_complete: BadgeInfo,
    ticket_creation_failed: ShieldAlert,
    ticket_created_finish: CircleCheck,
    default: CircleX
}

export default function MonitoringPage() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const eventSource = new EventSource('/api/monitoring/events');
    
    eventSource.onmessage = (event) => {
        try {
            const newEvent = JSON.parse(event.data);
            setEvents(prevEvents => [newEvent, ...prevEvents]);
        } catch (error) {
            console.error("Failed to parse event data:", error);
        }
    };
    
    eventSource.onerror = (error) => {
        console.error("EventSource failed:", error);
        eventSource.close();
    };

    return () => {
        eventSource.close();
    };
  }, []);

  const getEventIcon = (event: any) => {
    const ActorIcon = iconMap[event.actor?.type] || iconMap.default;
    const ActionIcon = iconMap[event.action] || null;
    return ActionIcon ? <ActionIcon className="h-5 w-5" /> : <ActorIcon className="h-5 w-5" />;
  }

  const getEventTitle = (event: any) => {
      const actionText = event.action.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
      const actorName = event.actor?.name || 'Unknown';
      return `${actionText} by ${actorName}`;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Live Event Monitoring</h1>
        <p className="text-muted-foreground">
          Real-time stream of events happening across the system.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Event Stream</CardTitle>
          <CardDescription>New events will appear at the top automatically.</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[60vh] border rounded-md">
            <div className="p-4 space-y-4">
                {events.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                        <Workflow className="h-12 w-12 mb-4" />
                        <p className="text-lg font-semibold">Waiting for events...</p>
                        <p className="text-sm">As actions occur in the system, they will be displayed here.</p>
                    </div>
                )}
                {events.map((event, index) => (
                    <div key={index} className="flex items-start gap-4 p-3 bg-card rounded-lg border">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            {getEventIcon(event)}
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-card-foreground">{getEventTitle(event)}</p>
                            <pre className="mt-1 text-xs text-muted-foreground bg-muted p-2 rounded-md overflow-x-auto">
                                {JSON.stringify(event.details, null, 2)}
                            </pre>
                            <p className="text-xs text-muted-foreground mt-2">{formatRelativeTime(event.timestamp)}</p>
                        </div>
                    </div>
                ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
