import { Button } from "@/components/ui/button";
import { Building2, User, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ModeSelector = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
            Escolha o modo de acesso
          </h1>
          <p className="text-lg text-muted-foreground">
            Selecione como deseja gerenciar suas finanças
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
          {/* Pessoa Física */}
          <button
            onClick={() => navigate("/dashboard/personal")}
            className="group bg-card rounded-3xl p-8 md:p-10 shadow-[var(--shadow-card)] border border-border hover:shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-2 hover:border-primary/50 text-left"
          >
            <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center mb-6 group-hover:bg-primary group-hover:shadow-[var(--shadow-soft)] transition-all duration-300">
              <User className="w-8 h-8 text-accent-foreground group-hover:text-primary-foreground transition-colors duration-300" />
            </div>
            
            <h2 className="text-2xl font-bold text-card-foreground mb-3 group-hover:text-primary transition-colors duration-300">
              Pessoa Física
            </h2>
            
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Gerencie suas finanças pessoais, controle gastos, registre eventos e acompanhe suas metas financeiras
            </p>

            <div className="flex items-center text-primary font-semibold group-hover:translate-x-2 transition-transform duration-300">
              <span>Acessar modo pessoal</span>
              <ArrowRight className="ml-2 w-5 h-5" />
            </div>
          </button>

          {/* Empresa */}
          <button
            onClick={() => navigate("/dashboard/business")}
            className="group bg-card rounded-3xl p-8 md:p-10 shadow-[var(--shadow-card)] border border-border hover:shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-2 hover:border-primary/50 text-left"
          >
            <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center mb-6 group-hover:bg-primary group-hover:shadow-[var(--shadow-soft)] transition-all duration-300">
              <Building2 className="w-8 h-8 text-accent-foreground group-hover:text-primary-foreground transition-colors duration-300" />
            </div>
            
            <h2 className="text-2xl font-bold text-card-foreground mb-3 group-hover:text-primary transition-colors duration-300">
              Empresa
            </h2>
            
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Controle fluxo de caixa, gerencie prolabore, acompanhe lucros e mantenha a saúde financeira do seu negócio
            </p>

            <div className="flex items-center text-primary font-semibold group-hover:translate-x-2 transition-transform duration-300">
              <span>Acessar modo empresa</span>
              <ArrowRight className="ml-2 w-5 h-5" />
            </div>
          </button>
        </div>

        <div className="text-center mt-8">
          <button
            onClick={() => navigate("/login")}
            className="text-muted-foreground hover:text-primary transition-colors duration-200"
          >
            Sair
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModeSelector;
