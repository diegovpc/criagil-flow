import { Button } from "./ui/button";
import { Plus, Settings, User } from "lucide-react";

interface HeaderProps {
  onNewDemand: () => void;
}

export const Header = ({ onNewDemand }: HeaderProps) => {
  return (
    <header className="bg-gradient-hero shadow-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-foreground rounded-lg flex items-center justify-center font-bold text-primary text-xl">
                G
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary-foreground">GuiA</h1>
                <p className="text-sm text-primary-foreground/80">Gestão Unificada de Demandas</p>
              </div>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <a href="#dashboard" className="text-primary-foreground/90 hover:text-primary-foreground transition-colors">
              Dashboard
            </a>
            <a href="#kanban" className="text-primary-foreground/90 hover:text-primary-foreground transition-colors">
              Kanban
            </a>
            <a href="#metrics" className="text-primary-foreground/90 hover:text-primary-foreground transition-colors">
              Métricas
            </a>
            <a href="#reports" className="text-primary-foreground/90 hover:text-primary-foreground transition-colors">
              Relatórios
            </a>
          </nav>

          <div className="flex items-center space-x-3">
            <Button
              onClick={onNewDemand}
              variant="secondary"
              size="sm"
              className="shadow-card"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova Demanda
            </Button>
            
            <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10">
              <Settings className="w-4 h-4" />
            </Button>
            
            <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10">
              <User className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};