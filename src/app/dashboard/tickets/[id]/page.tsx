import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

import prisma from "@/lib/db"
import { Separator } from "@/components/ui/separator"
import { TicketDetailsCard } from "@/components/dashboard/ticket-details-card"
import { TicketLogs } from "@/components/dashboard/ticket-logs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SuggestReply } from "@/components/dashboard/suggest-reply"

export default async function TicketDetailPage({ params }: { params: { id: string } }) {
  const ticket = await prisma.ticket.findUnique({
    where: { id: params.id },
    include: {
      logs: { orderBy: { timestamp: 'asc' } },
      assignedTo: true,
      team: true,
    }
  })

  if (!ticket) {
    notFound()
  }
  
  const companyUsers = await prisma.user.findMany({ where: { companyId: ticket.companyId }});
  const companyTeams = await prisma.team.findMany({ where: { companyId: ticket.companyId }});

  const ticketContentForReply = `Customer: ${ticket.customerName} (${ticket.customerEmail})\nSubject: ${ticket.subject}\n\n${ticket.description}`

  return (
    <div className="space-y-6">
       <div>
         <Link href="/dashboard" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to Inbox
         </Link>
       </div>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{ticket.id}</p>
          <h1 className="text-3xl font-bold tracking-tight">{ticket.subject}</h1>
          <p className="text-muted-foreground">
            From {ticket.customerName} &lt;{ticket.customerEmail}&gt;
          </p>
        </div>
      </div>
      <Separator />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
            <Card>
                 <CardHeader>
                    <CardTitle>Description</CardTitle>
                 </CardHeader>
                 <CardContent>
                    <p className="whitespace-pre-wrap text-sm">{ticket.description}</p>
                 </CardContent>
            </Card>

            <SuggestReply ticketContent={ticketContentForReply} />
        </div>

        <div className="lg:col-span-1 space-y-6">
          <TicketDetailsCard ticket={ticket} users={companyUsers} teams={companyTeams} />
          <TicketLogs logs={ticket.logs} />
        </div>
      </div>
    </div>
  )
}
