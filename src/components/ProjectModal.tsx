import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Project } from "@/types";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Omit<Project, "id" | "createdAt">) => void;
  onUpdate: (project: Project) => void;
  onDelete: (projectId: string) => void;
  project?: Project | null;
  mode: "create" | "edit";
}

const predefinedColors = [
  "#3B82F6", // blue
  "#10B981", // emerald  
  "#F59E0B", // amber
  "#EF4444", // red
  "#8B5CF6", // violet
  "#06B6D4", // cyan
  "#84CC16", // lime
  "#F97316", // orange
];

export const ProjectModal = ({
  isOpen,
  onClose,
  onSave,
  onUpdate,
  onDelete,
  project,
  mode
}: ProjectModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: predefinedColors[0],
    isActive: true
  });

  useEffect(() => {
    if (project && mode === "edit") {
      setFormData({
        name: project.name,
        description: project.description,
        color: project.color,
        isActive: project.isActive
      });
    } else {
      setFormData({
        name: "",
        description: "",
        color: predefinedColors[0],
        isActive: true
      });
    }
  }, [project, mode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === "create") {
      onSave(formData);
    } else if (project) {
      onUpdate({
        ...project,
        ...formData
      });
    }
    
    onClose();
  };

  const handleDelete = () => {
    if (project && window.confirm("Tem certeza que deseja excluir este projeto?")) {
      onDelete(project.id);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Novo Projeto" : "Editar Projeto"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome do Projeto *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
              placeholder="Digite o nome do projeto"
            />
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              placeholder="Descreva o objetivo do projeto"
            />
          </div>

          <div>
            <Label>Cor do Projeto</Label>
            <div className="flex gap-2 mt-2">
              {predefinedColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-8 h-8 rounded-full border-2 ${
                    formData.color === color ? "border-foreground" : "border-border"
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setFormData(prev => ({ ...prev, color }))}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="isActive">Projeto Ativo</Label>
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
            />
          </div>

          <div className="flex justify-between pt-4">
            <div>
              {mode === "edit" && (
                <Button 
                  type="button" 
                  variant="destructive" 
                  onClick={handleDelete}
                >
                  Excluir
                </Button>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">
                {mode === "create" ? "Criar Projeto" : "Salvar Alterações"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};