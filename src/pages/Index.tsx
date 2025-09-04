import { useState, useMemo } from "react";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import { Header } from "@/components/Header";
import { MetricsCard } from "@/components/MetricsCard";
import { KanbanColumn } from "@/components/KanbanColumn";
import { IntakeModal } from "@/components/IntakeModal";
import { SearchBar } from "@/components/SearchBar";
import { DemandEditModal } from "@/components/DemandEditModal";
import { ProjectModal } from "@/components/ProjectModal";
import { Demand, Project, User, KanbanStatus } from "@/types";
import { Clock, Users, TrendingUp, CheckCircle, AlertCircle, Timer, Plus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockDemands, mockProjects, mockUsers } from "@/data/mockData";

const Index = () => {
  const [isIntakeModalOpen, setIsIntakeModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingDemand, setEditingDemand] = useState<Demand | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectModalMode, setProjectModalMode] = useState<"create" | "edit">("create");
  
  const [demands, setDemands] = useState(mockDemands);
  const [projects, setProjects] = useState(mockProjects);
  const [users] = useState(mockUsers);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState("all");
  const [selectedAssignee, setSelectedAssignee] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");

  // Filter demands based on search and filters
  const filteredDemands = useMemo(() => {
    const allDemands = Object.values(demands).flat();
    
    return allDemands.filter(demand => {
      const matchesSearch = searchTerm === "" || 
        demand.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        demand.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        demand.stakeholder.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesProject = selectedProject === "all" || demand.projectId === selectedProject;
      const matchesAssignee = selectedAssignee === "all" || demand.assignees.some(a => a.id === selectedAssignee);
      const matchesType = selectedType === "all" || demand.type === selectedType;
      const matchesPriority = selectedPriority === "all" || demand.priority === selectedPriority;
      
      return matchesSearch && matchesProject && matchesAssignee && matchesType && matchesPriority;
    });
  }, [demands, searchTerm, selectedProject, selectedAssignee, selectedType, selectedPriority]);

  // Group filtered demands by status
  const groupedFilteredDemands = useMemo(() => {
    const grouped: Record<KanbanStatus, Demand[]> = {
      backlog: [],
      todo: [],
      progress: [],
      frozen: [],
      validate: [],
      done: []
    };
    
    filteredDemands.forEach(demand => {
      grouped[demand.status].push(demand);
    });
    
    return grouped;
  }, [filteredDemands]);

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

  const handleEditDemand = (demand: Demand) => {
    setEditingDemand(demand);
    setIsEditModalOpen(true);
  };

  const handleSaveDemand = (updatedDemand: Demand) => {
    setDemands(prevDemands => {
      const newDemands = { ...prevDemands };
      
      // Remove from old status
      Object.keys(newDemands).forEach(status => {
        newDemands[status as KanbanStatus] = newDemands[status as KanbanStatus].filter(d => d.id !== updatedDemand.id);
      });
      
      // Add to new status
      newDemands[updatedDemand.status].push(updatedDemand);
      
      return newDemands;
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) return;
    
    const draggedDemandId = active.id as string;
    const newStatus = over.id as KanbanStatus;
    
    setDemands(prevDemands => {
      const newDemands = { ...prevDemands };
      let draggedDemand: Demand | null = null;
      
      // Find and remove the dragged demand from its current status
      Object.keys(newDemands).forEach(status => {
        const index = newDemands[status as KanbanStatus].findIndex(d => d.id === draggedDemandId);
        if (index !== -1) {
          [draggedDemand] = newDemands[status as KanbanStatus].splice(index, 1);
        }
      });
      
      // Add to new status with updated status field
      if (draggedDemand) {
        draggedDemand.status = newStatus;
        newDemands[newStatus].push(draggedDemand);
      }
      
      return newDemands;
    });
  };

  const handleNewProject = (projectData: Omit<Project, "id" | "createdAt">) => {
    const project: Project = {
      ...projectData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setProjects(prev => [...prev, project]);
  };

  const handleUpdateProject = (updatedProject: Project) => {
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
  };

  const totalDemands = Object.values(demands).flat().length;
  const completedDemands = demands.done.length;
  const inProgressDemands = demands.progress.length;
  const avgLeadTime = "7.2"; // Mock data

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="min-h-screen bg-background">
        <Header onNewDemand={() => setIsIntakeModalOpen(true)} />
        
        <main className="container mx-auto px-6 py-8">
          {/* Search and Filters */}
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedProject={selectedProject}
            onProjectChange={setSelectedProject}
            selectedAssignee={selectedAssignee}
            onAssigneeChange={setSelectedAssignee}
            selectedType={selectedType}
            onTypeChange={setSelectedType}
            selectedPriority={selectedPriority}
            onPriorityChange={setSelectedPriority}
            projects={projects}
            users={users}
            totalResults={filteredDemands.length}
          />

          {/* Project Management */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Projetos</h2>
            <Button onClick={() => { setProjectModalMode("create"); setIsProjectModalOpen(true); }}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Projeto
            </Button>
          </div>

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
                demands={groupedFilteredDemands.backlog}
                projects={projects}
                bgColor="bg-kanban-backlog"
                maxItems={5}
                onEdit={handleEditDemand}
                status="backlog"
              />
              <KanbanColumn
                title="A Fazer"
                emoji="🚀"
                demands={groupedFilteredDemands.todo}
                projects={projects}
                bgColor="bg-kanban-todo"
                maxItems={5}
                onEdit={handleEditDemand}
                status="todo"
              />
              <KanbanColumn
                title="Em Andamento"
                emoji="⚡"
                demands={groupedFilteredDemands.progress}
                projects={projects}
                bgColor="bg-kanban-progress"
                maxItems={3}
                onEdit={handleEditDemand}
                status="progress"
              />
              <KanbanColumn
                title="Geladeira"
                emoji="❄️"
                demands={groupedFilteredDemands.frozen}
                projects={projects}
                bgColor="bg-kanban-frozen"
                maxItems={5}
                onEdit={handleEditDemand}
                status="frozen"
              />
              <KanbanColumn
                title="A Validar"
                emoji="✔️"
                demands={groupedFilteredDemands.validate}
                projects={projects}
                bgColor="bg-kanban-validate"
                maxItems={5}
                onEdit={handleEditDemand}
                status="validate"
              />
              <KanbanColumn
                title="Feito"
                emoji="🏆"
                demands={groupedFilteredDemands.done}
                projects={projects}
                bgColor="bg-kanban-done"
                maxItems={5}
                onEdit={handleEditDemand}
                status="done"
              />
            </div>
          </section>
        </main>

        {/* Modals */}
        <IntakeModal
          isOpen={isIntakeModalOpen}
          onClose={() => setIsIntakeModalOpen(false)}
          onSubmit={handleNewDemand}
          projects={projects}
          users={users}
        />

        <DemandEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveDemand}
          demand={editingDemand}
          projects={projects}
          users={users}
        />

        <ProjectModal
          isOpen={isProjectModalOpen}
          onClose={() => setIsProjectModalOpen(false)}
          onSave={handleNewProject}
          onUpdate={handleUpdateProject}
          onDelete={handleDeleteProject}
          project={editingProject}
          mode={projectModalMode}
        />
      </div>
    </DndContext>
  );
};

export default Index;