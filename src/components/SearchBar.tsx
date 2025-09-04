import { Search, Filter } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Project, User } from "@/types";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedProject: string;
  onProjectChange: (projectId: string) => void;
  selectedAssignee: string;
  onAssigneeChange: (assigneeId: string) => void;
  selectedType: string;
  onTypeChange: (type: string) => void;
  selectedPriority: string;
  onPriorityChange: (priority: string) => void;
  projects: Project[];
  users: User[];
  totalResults: number;
}

export const SearchBar = ({
  searchTerm,
  onSearchChange,
  selectedProject,
  onProjectChange,
  selectedAssignee,
  onAssigneeChange,
  selectedType,
  onTypeChange,
  selectedPriority,
  onPriorityChange,
  projects,
  users,
  totalResults
}: SearchBarProps) => {
  const activeFilters = [
    selectedProject !== "all" && "Projeto",
    selectedAssignee !== "all" && "Responsável", 
    selectedType !== "all" && "Tipo",
    selectedPriority !== "all" && "Prioridade"
  ].filter(Boolean);

  return (
    <div className="bg-card border rounded-lg p-4 mb-6 shadow-card">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar demandas por título, descrição ou stakeholder..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <Select value={selectedProject} onValueChange={onProjectChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Projeto" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os projetos</SelectItem>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedAssignee} onValueChange={onAssigneeChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Responsável" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedType} onValueChange={onTypeChange}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              <SelectItem value="feature">Feature</SelectItem>
              <SelectItem value="bug">Bug</SelectItem>
              <SelectItem value="support">Support</SelectItem>
              <SelectItem value="improvement">Improvement</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedPriority} onValueChange={onPriorityChange}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Prioridade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="crítica">Crítica</SelectItem>
              <SelectItem value="alta">Alta</SelectItem>
              <SelectItem value="média">Média</SelectItem>
              <SelectItem value="baixa">Baixa</SelectItem>
            </SelectContent>
          </Select>

          {activeFilters.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onProjectChange("all");
                onAssigneeChange("all");
                onTypeChange("all");
                onPriorityChange("all");
              }}
              className="text-muted-foreground"
            >
              Limpar filtros
            </Button>
          )}
        </div>
      </div>

      {/* Results info */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="w-4 h-4" />
          <span>{totalResults} demandas encontradas</span>
        </div>
        
        {activeFilters.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Filtros ativos:</span>
            {activeFilters.map((filter) => (
              <Badge key={filter} variant="secondary" className="text-xs">
                {filter}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};