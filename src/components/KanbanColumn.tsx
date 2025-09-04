import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

export interface Demand {
  id: string;
  title: string;
  description: string;
  type: "feature" | "bug" | "support" | "improvement";
  priority: "baixa" | "média" | "alta" | "crítica";
  stakeholder: string;
  assignee?: string;
  createdAt: Date;
  dueDate?: Date;
  estimatedHours?: number;
  tags?: string[];
}

interface KanbanColumnProps {
  title: string;
  demands: Demand[];
  bgColor: string;
  emoji: string;
  maxItems?: number;
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

export const KanbanColumn = ({ title, demands, bgColor, emoji, maxItems }: KanbanColumnProps) => {
  const displayedDemands = maxItems ? demands.slice(0, maxItems) : demands;
  const hiddenCount = demands.length - displayedDemands.length;

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

      <div className="flex-1 space-y-3 overflow-y-auto">
        {displayedDemands.map((demand) => (
          <Card key={demand.id} className="shadow-card hover:shadow-card-hover transition-all duration-200 cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-sm font-medium leading-tight">
                  {demand.title}
                </CardTitle>
                <div className="flex gap-1 ml-2 flex-shrink-0">
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
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {demand.description}
              </p>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
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
                  <span>{demand.estimatedHours}h</span>
                )}
              </div>

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
        ))}

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