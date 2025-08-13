export type Plan = {
  id: 'starter' | 'pro' | 'enterprise';
  name: string;
  price: number;
  tasks: number | 'unlimited';
  agents: number;
};

export type Company = {
  id: string;
  name: string;
  plan: Plan;
  usage: {
    tasks: number;
    agents: number;
  };
};

export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  teamId: string;
  companyId: string;
  role: 'agent' | 'admin';
};

export type Team = {
  id: string;
  name: string;
  companyId: string;
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
  companyId: string;
};
