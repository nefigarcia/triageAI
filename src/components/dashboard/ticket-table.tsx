"use client"

import Link from "next/link"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"

import type { Ticket, User } from "@/lib/types"
import { formatRelativeTime } from "@/lib/utils"

interface TicketTableProps {
  tickets: Ticket[]
}

const statusVariantMap: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
  open: "default",
  in_progress: "secondary",
  closed: "outline",
  escalated: "destructive",
}

const urgencyVariantMap: { [key: string]: "default" | "secondary" | "destructive" } = {
  low: "secondary",
  medium: "default",
  high: "destructive",
}

const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
}


export function TicketTable({ tickets }: TicketTableProps) {
  if (tickets.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 border rounded-lg">
        <p className="text-muted-foreground">No tickets found.</p>
      </div>
    )
  }
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">Ticket ID</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead className="w-[120px]">Status</TableHead>
            <TableHead className="w-[120px]">Urgency</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Agent</TableHead>
            <TableHead className="w-[150px]">Created</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((ticket) => {
            const agent = ticket.assignedTo as User | undefined
            return (
              <TableRow key={ticket.id}>
                <TableCell>
                  <Link href={`/dashboard/tickets/${ticket.id}`} className="font-medium text-primary hover:underline">
                    {ticket.id.substring(0, 8)}...
                  </Link>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium truncate max-w-xs">{ticket.subject}</span>
                    <span className="text-sm text-muted-foreground">{ticket.customerName}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariantMap[ticket.status] || "default"} className="capitalize">
                    {ticket.status.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={urgencyVariantMap[ticket.urgency] || "default"} className="capitalize">
                    {ticket.urgency}
                  </Badge>
                </TableCell>
                <TableCell>{ticket.category}</TableCell>
                <TableCell>
                  {agent ? (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={agent.avatarUrl} alt={agent.name} />
                        <AvatarFallback>{getInitials(agent.name)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{agent.name}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Unassigned</span>
                  )}
                </TableCell>
                <TableCell>{formatRelativeTime(ticket.createdAt)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/tickets/${ticket.id}`}>View Details</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>Mark as In Progress</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
