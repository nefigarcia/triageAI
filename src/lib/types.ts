import type { Ticket as PrismaTicket, User as PrismaUser, Team as PrismaTeam, TicketLog as PrismaTicketLog, Company as PrismaCompany, Plan as PrismaPlan } from '@prisma/client';

export type Plan = PrismaPlan;

export type Company = PrismaCompany & {
  plan: Plan;
};

export type User = PrismaUser;
export type Team = PrismaTeam;

export type TicketLog = Omit<PrismaTicketLog, 'timestamp'> & {
  timestamp: string | Date;
}

export type Ticket = Omit<PrismaTicket, 'createdAt'> & {
  createdAt: string | Date;
  assignedTo?: User | null;
  team?: Team | null;
  logs: TicketLog[];
};
