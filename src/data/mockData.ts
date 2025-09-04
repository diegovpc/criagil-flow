import { Demand, Project, User } from "@/types";

export const mockUsers: User[] = [
  {
    id: "1",
    name: "Maria Santos",
    email: "maria.santos@gepes.com",
    avatar: undefined
  },
  {
    id: "2", 
    name: "Carlos Oliveira",
    email: "carlos.oliveira@gepes.com",
    avatar: undefined
  },
  {
    id: "3",
    name: "Ana Costa", 
    email: "ana.costa@gepes.com",
    avatar: undefined
  },
  {
    id: "4",
    name: "Pedro Lima",
    email: "pedro.lima@gepes.com", 
    avatar: undefined
  },
  {
    id: "5",
    name: "Roberto Alves",
    email: "roberto.alves@gepes.com",
    avatar: undefined
  }
];

export const mockProjects: Project[] = [
  {
    id: "1",
    name: "GuiA - Dashboard",
    description: "Desenvolvimento do dashboard principal do GuiA",
    color: "#3B82F6",
    createdAt: new Date("2024-01-01"),
    isActive: true
  },
  {
    id: "2",
    name: "Integração Sistemas",
    description: "Integração com sistemas legados da empresa",
    color: "#10B981", 
    createdAt: new Date("2024-01-10"),
    isActive: true
  },
  {
    id: "3",
    name: "Melhorias UX",
    description: "Otimizações de experiência do usuário",
    color: "#F59E0B",
    createdAt: new Date("2024-01-15"),
    isActive: true
  },
  {
    id: "4",
    name: "Infraestrutura",  
    description: "Melhorias de infraestrutura e performance",
    color: "#EF4444",
    createdAt: new Date("2024-01-05"),
    isActive: true
  }
];

export const mockDemands: Record<string, Demand[]> = {
  backlog: [
    {
      id: "1",
      title: "Implementar dashboard de métricas avançado",
      description: "Criar dashboard com métricas detalhadas do Criágil incluindo lead time, throughput e aging",
      type: "feature",
      priority: "alta",
      stakeholder: "João Silva",
      assignees: [mockUsers[0]],
      projectId: "1",
      status: "backlog",
      createdAt: new Date("2024-01-15"),
      estimatedHours: 40,
      tags: ["dashboard", "métricas", "criágil"]
    },
    {
      id: "2", 
      title: "Otimizar performance da consulta de demandas",
      description: "Melhorar performance das consultas no banco de dados para carregamento mais rápido",
      type: "improvement",
      priority: "média",
      stakeholder: "Ana Costa",
      assignees: [],
      projectId: "4",
      status: "backlog",
      createdAt: new Date("2024-01-20"),
      estimatedHours: 16
    }
  ],
  todo: [
    {
      id: "3",
      title: "Corrigir bug no formulário de intake",
      description: "Formulário não está validando campos obrigatórios corretamente",
      type: "bug", 
      priority: "crítica",
      stakeholder: "Pedro Lima",
      assignees: [mockUsers[1]],
      projectId: "1",
      status: "todo",
      createdAt: new Date("2024-01-22"),
      estimatedHours: 8,
      dueDate: new Date("2024-01-25")
    }
  ],
  progress: [
    {
      id: "4",
      title: "Desenvolver integração com sistema legado",
      description: "Integrar GuiA com o sistema de gestão atual da empresa",
      type: "feature",
      priority: "alta", 
      stakeholder: "Roberto Alves",
      assignees: [mockUsers[2], mockUsers[3]],
      projectId: "2",
      status: "progress",
      createdAt: new Date("2024-01-18"),
      estimatedHours: 60,
      tags: ["integração", "legado"]
    }
  ],
  frozen: [],
  validate: [
    {
      id: "5",
      title: "Implementar notificações por email",
      description: "Sistema de notificações automáticas para stakeholders",
      type: "feature",
      priority: "média",
      stakeholder: "Lucia Ferreira", 
      assignees: [mockUsers[3]],
      projectId: "3",
      status: "validate",
      createdAt: new Date("2024-01-10"),
      estimatedHours: 24
    }
  ],
  done: [
    {
      id: "6",
      title: "Setup inicial do projeto GuiA",
      description: "Configuração da arquitetura base e design system",
      type: "feature",
      priority: "alta",
      stakeholder: "Equipe Gepes",
      assignees: [mockUsers[0], mockUsers[1], mockUsers[2]],
      projectId: "1",
      status: "done",
      createdAt: new Date("2024-01-05"),
      estimatedHours: 32,
      tags: ["setup", "arquitetura"]
    }
  ]
};