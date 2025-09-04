import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { X, Plus } from "lucide-react";
import { Demand } from "./KanbanColumn";

interface IntakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (demand: Omit<Demand, "id" | "createdAt">) => void;
}

export const IntakeModal = ({ isOpen, onClose, onSubmit }: IntakeModalProps) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "" as Demand["type"] | "",
    priority: "" as Demand["priority"] | "",
    stakeholder: "",
    assignee: "",
    estimatedHours: "",
    dueDate: "",
    tags: [] as string[]
  });

  const [newTag, setNewTag] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.type || !formData.priority || !formData.stakeholder) {
      return;
    }

    const demand: Omit<Demand, "id" | "createdAt"> = {
      title: formData.title,
      description: formData.description,
      type: formData.type as Demand["type"],
      priority: formData.priority as Demand["priority"],
      stakeholder: formData.stakeholder,
      assignee: formData.assignee || undefined,
      estimatedHours: formData.estimatedHours ? Number(formData.estimatedHours) : undefined,
      dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
      tags: formData.tags.length > 0 ? formData.tags : undefined
    };

    onSubmit(demand);
    setFormData({
      title: "",
      description: "",
      type: "",
      priority: "",
      stakeholder: "",
      assignee: "",
      estimatedHours: "",
      dueDate: "",
      tags: []
    });
    onClose();
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Nova Demanda - Formulário de Intake</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="title">Título da Demanda *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Descreva brevemente a demanda"
                required
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description">Descrição e Objetivo *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Detalhe a demanda, seu objetivo e impacto esperado"
                className="min-h-[100px]"
                required
              />
            </div>

            <div>
              <Label htmlFor="type">Tipo de Demanda *</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as Demand["type"] }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="feature">Nova Funcionalidade</SelectItem>
                  <SelectItem value="improvement">Melhoria</SelectItem>
                  <SelectItem value="bug">Correção de Bug</SelectItem>
                  <SelectItem value="support">Suporte</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priority">Prioridade (Custo de Atraso) *</Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value as Demand["priority"] }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baixa">Baixa</SelectItem>
                  <SelectItem value="média">Média</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="crítica">Crítica</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="stakeholder">Stakeholder Solicitante *</Label>
              <Input
                id="stakeholder"
                value={formData.stakeholder}
                onChange={(e) => setFormData(prev => ({ ...prev, stakeholder: e.target.value }))}
                placeholder="Nome do solicitante"
                required
              />
            </div>

            <div>
              <Label htmlFor="assignee">Responsável</Label>
              <Input
                id="assignee"
                value={formData.assignee}
                onChange={(e) => setFormData(prev => ({ ...prev, assignee: e.target.value }))}
                placeholder="Responsável pela execução"
              />
            </div>

            <div>
              <Label htmlFor="estimatedHours">Estimativa (horas)</Label>
              <Input
                id="estimatedHours"
                type="number"
                value={formData.estimatedHours}
                onChange={(e) => setFormData(prev => ({ ...prev, estimatedHours: e.target.value }))}
                placeholder="Estimativa em horas"
                min="1"
              />
            </div>

            <div>
              <Label htmlFor="dueDate">Prazo Desejado</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label>Tags</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Adicionar tag"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} size="icon" variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X 
                      className="w-3 h-3 cursor-pointer hover:text-destructive" 
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              Criar Demanda
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};