import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { X, UserPlus } from "lucide-react";
import { Demand, Project, User } from "@/types";

interface DemandEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (demand: Demand) => void;
  demand: Demand | null;
  projects: Project[];
  users: User[];
}

export const DemandEditModal = ({
  isOpen,
  onClose,
  onSave,
  demand,
  projects,
  users
}: DemandEditModalProps) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "feature" as Demand["type"],
    priority: "média" as Demand["priority"],
    stakeholder: "",
    projectId: "",
    assignees: [] as User[],
    estimatedHours: "",
    dueDate: "",
    tags: "" as string
  });

  useEffect(() => {
    if (demand) {
      setFormData({
        title: demand.title,
        description: demand.description,
        type: demand.type,
        priority: demand.priority,
        stakeholder: demand.stakeholder,
        projectId: demand.projectId,
        assignees: demand.assignees,
        estimatedHours: demand.estimatedHours?.toString() || "",
        dueDate: demand.dueDate ? demand.dueDate.toISOString().split('T')[0] : "",
        tags: demand.tags?.join(', ') || ""
      });
    }
  }, [demand]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!demand) return;

    const updatedDemand: Demand = {
      ...demand,
      title: formData.title,
      description: formData.description,
      type: formData.type,
      priority: formData.priority,
      stakeholder: formData.stakeholder,
      projectId: formData.projectId,
      assignees: formData.assignees,
      estimatedHours: formData.estimatedHours ? parseInt(formData.estimatedHours) : undefined,
      dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : undefined
    };

    onSave(updatedDemand);
    onClose();
  };

  const addAssignee = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user && !formData.assignees.find(a => a.id === userId)) {
      setFormData(prev => ({
        ...prev,
        assignees: [...prev.assignees, user]
      }));
    }
  };

  const removeAssignee = (userId: string) => {
    setFormData(prev => ({
      ...prev,
      assignees: prev.assignees.filter(a => a.id !== userId)
    }));
  };

  const availableUsers = users.filter(user => 
    !formData.assignees.find(a => a.id === user.id)
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Demanda</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description">Descrição *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                required
              />
            </div>

            <div>
              <Label htmlFor="project">Projeto *</Label>
              <Select value={formData.projectId} onValueChange={(value) => setFormData(prev => ({ ...prev, projectId: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o projeto" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="type">Tipo *</Label>
              <Select value={formData.type} onValueChange={(value: Demand["type"]) => setFormData(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="feature">Feature</SelectItem>
                  <SelectItem value="bug">Bug</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                  <SelectItem value="improvement">Improvement</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priority">Prioridade *</Label>
              <Select value={formData.priority} onValueChange={(value: Demand["priority"]) => setFormData(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="crítica">Crítica</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="média">Média</SelectItem>
                  <SelectItem value="baixa">Baixa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="stakeholder">Stakeholder *</Label>
              <Input
                id="stakeholder"
                value={formData.stakeholder}
                onChange={(e) => setFormData(prev => ({ ...prev, stakeholder: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="estimatedHours">Horas Estimadas</Label>
              <Input
                id="estimatedHours"
                type="number"
                value={formData.estimatedHours}
                onChange={(e) => setFormData(prev => ({ ...prev, estimatedHours: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="dueDate">Data Limite</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
              />
            </div>

            <div className="md:col-span-2">
              <Label>Responsáveis</Label>
              <div className="space-y-2">
                {formData.assignees.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.assignees.map((assignee) => (
                      <Badge key={assignee.id} variant="secondary" className="flex items-center gap-1">
                        {assignee.name}
                        <X 
                          className="w-3 h-3 cursor-pointer hover:text-destructive" 
                          onClick={() => removeAssignee(assignee.id)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
                
                {availableUsers.length > 0 && (
                  <Select onValueChange={addAssignee}>
                    <SelectTrigger>
                      <SelectValue placeholder="Adicionar responsável" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableUsers.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          <div className="flex items-center gap-2">
                            <UserPlus className="w-4 h-4" />
                            {user.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="ex: urgente, cliente, integração"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              Salvar Alterações
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};