import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { cn } from "@/lib/utils";
import { Edit, Clock, User } from "lucide-react";
import { Demand, Project, KanbanStatus } from "@/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface DraggableCardProps {
  demand: Demand;
  project: Project;
  onEdit: (demand: Demand) => void;
}

const DraggableCard = ({ demand, project, onEdit }: DraggableCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: demand.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      className="shadow-card hover:shadow-card-hover transition-all duration-200 cursor-grab active:cursor-grabbing"
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-sm font-medium leading-tight">
            {demand.title}
          </CardTitle>
          <div className="flex gap-1 ml-2 flex-shrink-0">
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(demand);
              }}
              className="h-6 w-6 p-0"
            >
              <Edit className="w-3 h-3" />
            </Button>
            <Badge
              variant="outline"
              className={cn("text-xs", priorityColors[demand.priority])}
            >
              {demand.priority}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center gap-2 mb-2">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: project.color }}
          />
          <span className="text-xs text-muted-foreground">{project.name}</span>
        </div>
        
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {demand.description}
        </p>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={cn("text-xs", typeColors[demand.type])}
            >
              {demand.type}
            </Badge>
            <span>{demand.stakeholder}</span>
          </div>
          {demand.estimatedHours && (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{demand.estimatedHours}h</span>
            </div>
          )}
        </div>

        {demand.assignees && demand.assignees.length > 0 && (
          <div className="flex items-center gap-2 mb-2">
            <User className="w-3 h-3 text-muted-foreground" />
            <div className="flex -space-x-1">
              {demand.assignees.slice(0, 3).map((assignee) => (
                <Avatar key={assignee.id} className="w-6 h-6 border-2 border-background">
                  <AvatarImage src={assignee.avatar} />
                  <AvatarFallback className="text-xs">
                    {assignee.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
              ))}
              {demand.assignees.length > 3 && (
                <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs">
                  +{demand.assignees.length - 3}
                </div>
              )}
            </div>
          </div>
        )}

        {demand.tags && demand.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {demand.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs bg-accent">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface KanbanColumnProps {
  title: string;
  demands: Demand[];
  projects: Project[];
  bgColor: string;
  emoji: string;
  maxItems?: number;
  onEdit: (demand: Demand) => void;
  status: KanbanStatus;
}

const priorityColors = {
  baixa: "bg-muted text-muted-foreground",
  média: "bg-warning/20 text-warning-foreground border-warning/30",
  alta: "bg-destructive/20 text-destructive-foreground border-destructive/30", 
  crítica: "bg-destructive text-destructive-foreground"
};

const typeColors = {
  feature: "bg-primary/10 text-primary border-primary/20",
  bug: "bg-destructive/10 text-destructive border-destructive/20",
  support: "bg-secondary/10 text-secondary border-secondary/20",
  improvement: "bg-success/10 text-success border-success/20"
};

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

export const KanbanColumn = ({ 
  title, 
  demands, 
  projects, 
  bgColor, 
  emoji, 
  maxItems, 
  onEdit, 
  status 
}: KanbanColumnProps) => {
  const displayedDemands = maxItems ? demands.slice(0, maxItems) : demands;
  const hiddenCount = demands.length - displayedDemands.length;

  const { setNodeRef } = useDroppable({
    id: status,
  });

  return (
    <div className="flex flex-col h-full min-w-[300px]">
      <div className={cn("rounded-lg p-4 mb-4", bgColor)}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <span className="text-lg">{emoji}</span>
            {title}
          </h3>
          <Badge variant="secondary" className="text-xs">
            {demands.length}
          </Badge>
        </div>
      </div>

      <div ref={setNodeRef} className="flex-1 space-y-3 overflow-y-auto">
        <SortableContext items={displayedDemands.map(d => d.id)} strategy={verticalListSortingStrategy}>
          {displayedDemands.map((demand) => {
            const project = projects.find(p => p.id === demand.projectId) || {
              id: 'unknown',
              name: 'Projeto não encontrado',
              color: '#6B7280',
              description: '',
              createdAt: new Date(),
              isActive: true
            };
            
            return (
              <DraggableCard 
                key={demand.id}
                demand={demand}
                project={project}
                onEdit={onEdit}
              />
            );
          })}
        </SortableContext>

        {hiddenCount > 0 && (
          <Card className="border-dashed border-2 border-muted-foreground/30">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground">
                +{hiddenCount} outras demandas
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};