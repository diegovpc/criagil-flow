export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  createdAt: Date;
  isActive: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Demand {
  id: string;
  title: string;
  description: string;
  type: "feature" | "bug" | "support" | "improvement";
  priority: "baixa" | "média" | "alta" | "crítica";
  stakeholder: string;
  assignees: User[];
  projectId: string;
  status: "backlog" | "todo" | "progress" | "frozen" | "validate" | "done";
  createdAt: Date;
  dueDate?: Date;
  estimatedHours?: number;
  tags?: string[];
}

export type KanbanStatus = "backlog" | "todo" | "progress" | "frozen" | "validate" | "done";