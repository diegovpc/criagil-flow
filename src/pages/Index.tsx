import { useState } from "react";
import { Header } from "@/components/Header";
import { MetricsCard } from "@/components/MetricsCard";
import { KanbanColumn, Demand } from "@/components/KanbanColumn";
import { IntakeModal } from "@/components/IntakeModal";
import { Clock, Users, TrendingUp, CheckCircle, AlertCircle, Timer } from "lucide-react";

// Mock data - em produção viria de uma API
const mockDemands: Record<string, Demand[]> = {
  backlog: [
    {
      id: "1",
      title: "Implementar dashboard de métricas avançado",
      description: "Criar dashboard com métricas detalhadas do Criágil incluindo lead time, throughput e aging",
      type: "feature",
      priority: "alta",
      stakeholder: "João Silva",
      assignee: "Maria Santos",
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
      assignee: "Carlos Oliveira",
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
      assignee: "Ana Costa",
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
      assignee: "Pedro Lima",
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
      assignee: "Equipe Dev",
      createdAt: new Date("2024-01-05"),
      estimatedHours: 32,
      tags: ["setup", "arquitetura"]
    }
  ]
};

const Index = () => {
  const [isIntakeModalOpen, setIsIntakeModalOpen] = useState(false);
  const [demands, setDemands] = useState(mockDemands);

  const handleNewDemand = (newDemand: Omit<Demand, "id" | "createdAt">) => {
    const demand: Demand = {
      ...newDemand,
      id: Date.now().toString(),
      createdAt: new Date(),
    };

    setDemands(prev => ({
      ...prev,
      backlog: [...prev.backlog, demand]
    }));
  };

  const totalDemands = Object.values(demands).flat().length;
  const completedDemands = demands.done.length;
  const inProgressDemands = demands.progress.length;
  const avgLeadTime = "7.2"; // Mock data

  return (
    <div className="min-h-screen bg-background">
      <Header onNewDemand={() => setIsIntakeModalOpen(true)} />
      
      <main className="container mx-auto px-6 py-8">
        {/* Seção de Métricas */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Métricas Criágil</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricsCard
              title="Total de Demandas"
              value={totalDemands}
              subtitle="Demandas ativas no sistema"
              icon={Users}
              trend={{ value: "+12%", isPositive: true }}
            />
            <MetricsCard
              title="Em Andamento"
              value={inProgressDemands}
              subtitle="Demandas sendo executadas"
              icon={Timer}
            />
            <MetricsCard
              title="Lead Time Médio"
              value={`${avgLeadTime} dias`}
              subtitle="Tempo médio de entrega"
              icon={Clock}
              trend={{ value: "-2.1 dias", isPositive: true }}
            />
            <MetricsCard
              title="Taxa de Conclusão"
              value={`${Math.round((completedDemands / totalDemands) * 100)}%`}
              subtitle="Demandas concluídas"
              icon={CheckCircle}
              trend={{ value: "+8%", isPositive: true }}
            />
          </div>
        </section>

        {/* Quadro Kanban Criágil */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Quadro Kanban Criágil</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <AlertCircle className="w-4 h-4" />
              <span>WIP Limit: Respeitando políticas explícitas</span>
            </div>
          </div>
          
          <div className="flex gap-6 overflow-x-auto pb-4">
            <KanbanColumn
              title="Backlog"
              emoji="🎯"
              demands={demands.backlog}
              bgColor="bg-kanban-backlog"
              maxItems={5}
            />
            <KanbanColumn
              title="A Fazer"
              emoji="🚀"
              demands={demands.todo}
              bgColor="bg-kanban-todo"
              maxItems={5}
            />
            <KanbanColumn
              title="Em Andamento"
              emoji="⚡"
              demands={demands.progress}
              bgColor="bg-kanban-progress"
              maxItems={3}
            />
            <KanbanColumn
              title="Geladeira"
              emoji="❄️"
              demands={demands.frozen}
              bgColor="bg-kanban-frozen"
              maxItems={5}
            />
            <KanbanColumn
              title="A Validar"
              emoji="✔️"
              demands={demands.validate}
              bgColor="bg-kanban-validate"
              maxItems={5}
            />
            <KanbanColumn
              title="Feito"
              emoji="🏆"
              demands={demands.done}
              bgColor="bg-kanban-done"
              maxItems={5}
            />
          </div>
        </section>
      </main>

      <IntakeModal
        isOpen={isIntakeModalOpen}
        onClose={() => setIsIntakeModalOpen(false)}
        onSubmit={handleNewDemand}
      />
    </div>
  );
};

export default Index;