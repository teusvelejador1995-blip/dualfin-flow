import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Plus, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PersonalDashboard = () => {
  const navigate = useNavigate();
  const [balance] = useState(5420.50);
  const [income] = useState(8500.00);
  const [expenses] = useState(3079.50);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/mode-selector")}
              className="rounded-xl"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                Modo Pessoa Física
              </h1>
              <p className="text-muted-foreground mt-1">
                Visão geral das suas finanças pessoais
              </p>
            </div>
          </div>
          
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-[var(--shadow-soft)] hover:shadow-lg transition-all duration-300">
            <Plus className="w-5 h-5 mr-2" />
            Nova Transação
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
          {/* Saldo */}
          <Card className="p-6 rounded-2xl shadow-[var(--shadow-card)] border-border bg-gradient-to-br from-primary to-primary-glow">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>
            <p className="text-primary-foreground/80 text-sm mb-2">Saldo Atual</p>
            <p className="text-3xl font-bold text-primary-foreground">
              R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </Card>

          {/* Entradas */}
          <Card className="p-6 rounded-2xl shadow-[var(--shadow-card)] border-border">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-success" />
              </div>
            </div>
            <p className="text-muted-foreground text-sm mb-2">Entradas do Mês</p>
            <p className="text-3xl font-bold text-card-foreground">
              R$ {income.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-success text-sm mt-2">+12% vs mês anterior</p>
          </Card>

          {/* Saídas */}
          <Card className="p-6 rounded-2xl shadow-[var(--shadow-card)] border-border">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-destructive" />
              </div>
            </div>
            <p className="text-muted-foreground text-sm mb-2">Saídas do Mês</p>
            <p className="text-3xl font-bold text-card-foreground">
              R$ {expenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-destructive text-sm mt-2">-5% vs mês anterior</p>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card className="p-6 rounded-2xl shadow-[var(--shadow-card)] border-border animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
          <h2 className="text-xl font-bold text-card-foreground mb-6">
            Transações Recentes
          </h2>
          
          <div className="space-y-4">
            {[
              { name: "Salário", amount: 5000, type: "income", date: "01/11/2025" },
              { name: "Freelance Design", amount: 1500, type: "income", date: "15/11/2025" },
              { name: "Supermercado", amount: -450.50, type: "expense", date: "10/11/2025" },
              { name: "Aluguel", amount: -1200, type: "expense", date: "05/11/2025" },
            ].map((transaction, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    transaction.type === "income" 
                      ? "bg-success/10" 
                      : "bg-destructive/10"
                  }`}>
                    {transaction.type === "income" ? (
                      <TrendingUp className="w-5 h-5 text-success" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-destructive" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-card-foreground">{transaction.name}</p>
                    <p className="text-sm text-muted-foreground">{transaction.date}</p>
                  </div>
                </div>
                <p className={`font-bold text-lg ${
                  transaction.type === "income" 
                    ? "text-success" 
                    : "text-destructive"
                }`}>
                  {transaction.amount > 0 ? "+" : ""}
                  R$ {Math.abs(transaction.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PersonalDashboard;
