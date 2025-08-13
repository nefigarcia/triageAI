import prisma from "@/lib/db"
import { TicketTable } from "@/components/dashboard/ticket-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function DashboardPage() {
  const allTickets = await prisma.ticket.findMany({
    include: { assignedTo: true, team: true },
    orderBy: { createdAt: 'desc' }
  });
  const openTickets = allTickets.filter(t => t.status === 'open' || t.status === 'in_progress');
  const escalatedTickets = allTickets.filter(t => t.status === 'escalated');
  const closedTickets = allTickets.filter(t => t.status === 'closed');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Inbox</h1>
        <p className="text-muted-foreground">
          Here are the latest support tickets.
        </p>
      </div>
      <Tabs defaultValue="open">
        <TabsList className="grid w-full grid-cols-4 sm:w-auto sm:inline-flex">
          <TabsTrigger value="open">Open</TabsTrigger>
          <TabsTrigger value="escalated">Escalated</TabsTrigger>
          <TabsTrigger value="all">All Tickets</TabsTrigger>
          <TabsTrigger value="closed">Closed</TabsTrigger>
        </TabsList>
        <TabsContent value="open">
            <TicketTable tickets={openTickets} />
        </TabsContent>
        <TabsContent value="escalated">
            <TicketTable tickets={escalatedTickets} />
        </TabsContent>
        <TabsContent value="all">
            <TicketTable tickets={allTickets} />
        </TabsContent>
        <TabsContent value="closed">
            <TicketTable tickets={closedTickets} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
