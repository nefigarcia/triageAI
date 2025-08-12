export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  teamId: string;
};

export type Team = {
  id: string;
  name: string;
};

export type TicketLog = {
  id: string;
  timestamp: string;
  actor: 'AI' | 'User';
  actorName: string;
  action: string;
  details: string;
};

export type Ticket = {
  id: string;
  subject: string;
  description: string;
  customerName: string;
  customerEmail: string;
  status: 'open' | 'in_progress' | 'closed' | 'escalated';
  urgency: 'low' | 'medium' | 'high';
  category: string;
  assignedTo?: User;
  team?: Team;
  createdAt: string;
  logs: TicketLog[];
};
