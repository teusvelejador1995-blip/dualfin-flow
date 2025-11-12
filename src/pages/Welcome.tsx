import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Users, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        {/* Header */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-primary-glow mb-6 shadow-lg">
            <TrendingUp className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-4 tracking-tight">
            DualFin
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Controle total das suas finanças pessoais e empresariais em um só lugar
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          <div className="bg-card rounded-2xl p-8 shadow-[var(--shadow-card)] border border-border hover:shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-accent-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-card-foreground mb-2">
              Dois Modos em Um
            </h3>
            <p className="text-muted-foreground">
              Gerencie suas finanças pessoais e empresariais separadamente com facilidade
            </p>
          </div>

          <div className="bg-card rounded-2xl p-8 shadow-[var(--shadow-card)] border border-border hover:shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-accent-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-card-foreground mb-2">
              Controle Inteligente
            </h3>
            <p className="text-muted-foreground">
              Registre entradas, saídas e visualize seu saldo em tempo real
            </p>
          </div>

          <div className="bg-card rounded-2xl p-8 shadow-[var(--shadow-card)] border border-border hover:shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-accent-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-card-foreground mb-2">
              Planejamento Simples
            </h3>
            <p className="text-muted-foreground">
              Organize eventos e acompanhe suas metas financeiras
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <Button
            onClick={() => navigate("/login")}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-6 text-lg font-semibold shadow-[var(--shadow-soft)] hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            Começar Agora
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
