import prisma from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Hand, Users, Zap } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default async function AnalyticsPage() {
  // For now, we'll just show the first company's data.
  // In a real app, you'd get this based on the logged-in user.
  const company = await prisma.company.findFirst({
    where: { id: "comp-acme" },
    include: { plan: true, _count: { select: { users: true } } },
  })

  if (!company) {
    return <p>Company not found.</p>
  }
  
  const plan = company.plan
  // In a real app, this would be calculated based on actual usage tracking
  const usage = {
    tasks: await prisma.ticketLog.count({ where: { ticket: { companyId: company.id } } }),
    agents: company._count.users,
  }


  const tasksConsumedPercentage =
    plan.tasks > 0 ? (usage.tasks / plan.tasks) * 100 : 0
  const agentsConsumedPercentage = (usage.agents / plan.agents) * 100

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {company.name} Analytics
        </h1>
        <p className="text-muted-foreground">
          Usage statistics for your team. You are on the{" "}
          <span className="font-semibold text-primary">{plan.name}</span> plan.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks Consumed</CardTitle>
            <Hand className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usage.tasks.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              out of {plan.tasks.toLocaleString()} for your plan
            </p>
            <Progress value={tasksConsumedPercentage} className="mt-2 h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usage.agents}</div>
            <p className="text-xs text-muted-foreground">
              out of {plan.agents} for your plan
            </p>
            <Progress value={agentsConsumedPercentage} className="mt-2 h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{company._count.users}</div>
            <p className="text-xs text-muted-foreground">
              users invited to the platform
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
