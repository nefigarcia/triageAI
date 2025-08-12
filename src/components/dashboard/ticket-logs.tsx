import { TicketLog } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatRelativeTime } from "@/lib/utils"
import { Bot, UserCircle } from "lucide-react"

export function TicketLogs({ logs }: { logs: TicketLog[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>History</CardTitle>
        <CardDescription>A log of all actions taken on this ticket.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-72">
          <div className="space-y-6">
            {logs.map((log) => (
              <div key={log.id} className="flex gap-4">
                <div className="flex-shrink-0">
                  {log.actor === "AI" ? (
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <Bot className="h-4 w-4 text-primary" />
                    </div>
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                        <UserCircle className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {log.action}
                    <span className="font-normal text-muted-foreground ml-2">by {log.actorName}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">{log.details}</p>
                  <p className="text-xs text-muted-foreground mt-1">{formatRelativeTime(log.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
