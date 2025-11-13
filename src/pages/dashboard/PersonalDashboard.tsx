import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Calendar as CalendarIcon, Plus, ArrowUpCircle, ArrowDownCircle, Wallet, CheckCircle2, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { TransactionTypeSelector } from "@/components/transactions/TransactionTypeSelector";
import { TransactionDialog } from "@/components/transactions/TransactionDialog";
import { TransactionType } from "@/contexts/DataContext";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const PersonalDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { transactions, getBalance, setBalance, addTransaction, updateTransaction } = useData();
  const { toast } = useToast();
  const [typeSelectorOpen, setTypeSelectorOpen] = useState(false);
  const [transactionDialogOpen, setTransactionDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<TransactionType>("income");
  const [balanceDialogOpen, setBalanceDialogOpen] = useState(false);
  const [newBalance, setNewBalance] = useState("");

  const currentBalance = getBalance("personal");

  // Filtrar transações do modo pessoal
  const personalTransactions = useMemo(() => {
    return transactions.filter((t) => t.mode === "personal");
  }, [transactions]);

  // Calcular entradas e saídas confirmadas do mês atual
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyStats = useMemo(() => {
    const confirmedTransactions = personalTransactions.filter((t) => {
      const date = new Date(t.date);
      return (
        t.status === "confirmed" &&
        date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear
      );
    });

    const income = confirmedTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.value, 0);

    const expenses = confirmedTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.value, 0);

    return { income, expenses };
  }, [personalTransactions, currentMonth, currentYear]);

  // Calcular saldo real baseado no saldo inicial + entradas - saídas confirmadas
  const calculatedBalance = useMemo(() => {
    const confirmedTransactions = personalTransactions.filter((t) => t.status === "confirmed");
    
    const totalIncome = confirmedTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.value, 0);

    const totalExpenses = confirmedTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.value, 0);

    return currentBalance + totalIncome - totalExpenses;
  }, [personalTransactions, currentBalance]);

  const handleSelectType = (type: TransactionType) => {
    setSelectedType(type);
    setTransactionDialogOpen(true);
  };

  const handleSaveTransaction = (data: any) => {
    addTransaction(data);
    toast({
      title: "Transação cadastrada!",
      description: `${data.type === "income" ? "Entrada" : "Despesa"} registrada com sucesso`,
    });
  };

  const handleToggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "pending" ? "confirmed" : "pending";
    updateTransaction(id, { status: newStatus });
    toast({
      title: newStatus === "confirmed" ? "Transação confirmada" : "Transação marcada como pendente",
    });
  };

  const handleUpdateBalance = () => {
    const value = parseFloat(newBalance);
    if (isNaN(value)) {
      toast({
        title: "Valor inválido",
        description: "Por favor, insira um valor numérico válido",
        variant: "destructive",
      });
      return;
    }

    setBalance("personal", value);
    setBalanceDialogOpen(false);
    setNewBalance("");
    toast({
      title: "Saldo atualizado!",
      description: "O saldo inicial foi atualizado com sucesso",
    });
  };

  // Ordenar transações por data (mais recentes primeiro)
  const sortedTransactions = useMemo(() => {
    return [...personalTransactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10); // Mostrar apenas as 10 mais recentes
  }, [personalTransactions]);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/mode-selector")}
              className="rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Modo Pessoa Física</h1>
              {user && <p className="text-muted-foreground">Olá, {user.name}</p>}
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => navigate("/calendar")}
              className="rounded-xl"
            >
              <CalendarIcon className="w-4 h-4 mr-2" />
              Calendário
            </Button>
            <Button
              onClick={() => setTypeSelectorOpen(true)}
              className="rounded-xl"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova Transação
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 hover:shadow-[var(--shadow-soft)] transition-all duration-300 cursor-pointer" onClick={() => setBalanceDialogOpen(true)}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xs text-muted-foreground">Clique para editar</span>
            </div>
            <h3 className="text-sm text-muted-foreground mb-1">Saldo Atual</h3>
            <p className="text-2xl font-bold text-card-foreground">
              {calculatedBalance.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </p>
          </Card>

          <Card className="p-6 hover:shadow-[var(--shadow-soft)] transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <ArrowUpCircle className="w-6 h-6 text-success" />
              </div>
            </div>
            <h3 className="text-sm text-muted-foreground mb-1">Entradas do Mês</h3>
            <p className="text-2xl font-bold text-success">
              {monthlyStats.income.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </p>
          </Card>

          <Card className="p-6 hover:shadow-[var(--shadow-soft)] transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                <ArrowDownCircle className="w-6 h-6 text-destructive" />
              </div>
            </div>
            <h3 className="text-sm text-muted-foreground mb-1">Saídas do Mês</h3>
            <p className="text-2xl font-bold text-destructive">
              {monthlyStats.expenses.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </p>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-card-foreground mb-4">
            Transações Recentes
          </h2>

          {sortedTransactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Nenhuma transação cadastrada</p>
              <p className="text-sm mt-2">Clique em "Nova Transação" para começar</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 hover:shadow-sm ${
                    transaction.status === "confirmed"
                      ? "bg-card border-border"
                      : "bg-muted/30 border-muted"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        transaction.type === "income"
                          ? "bg-success/10"
                          : "bg-destructive/10"
                      }`}
                    >
                      {transaction.type === "income" ? (
                        <ArrowUpCircle className="w-5 h-5 text-success" />
                      ) : (
                        <ArrowDownCircle className="w-5 h-5 text-destructive" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-card-foreground">
                        {transaction.description}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>
                          {format(new Date(transaction.date), "dd/MM/yyyy", {
                            locale: ptBR,
                          })}
                        </span>
                        {transaction.recurrence !== "once" && (
                          <span className="px-2 py-0.5 bg-accent rounded-md text-xs">
                            {transaction.recurrence === "monthly" ? "Mensal" : "Anual"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <p
                      className={`text-lg font-semibold ${
                        transaction.type === "income"
                          ? "text-success"
                          : "text-destructive"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}
                      {transaction.value.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </p>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleToggleStatus(transaction.id, transaction.status)}
                      className="rounded-full"
                    >
                      {transaction.status === "confirmed" ? (
                        <CheckCircle2 className="w-5 h-5 text-success" />
                      ) : (
                        <Clock className="w-5 h-5 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Dialogs */}
      <TransactionTypeSelector
        open={typeSelectorOpen}
        onOpenChange={setTypeSelectorOpen}
        onSelectType={handleSelectType}
      />

      <TransactionDialog
        open={transactionDialogOpen}
        onOpenChange={setTransactionDialogOpen}
        mode="personal"
        type={selectedType}
        onSave={handleSaveTransaction}
      />

      <Dialog open={balanceDialogOpen} onOpenChange={setBalanceDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Editar Saldo Inicial</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="balance">Novo Saldo</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  R$
                </span>
                <Input
                  id="balance"
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  className="pl-10"
                  value={newBalance}
                  onChange={(e) => setNewBalance(e.target.value)}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                O saldo atual é calculado automaticamente: Saldo Inicial + Entradas - Saídas confirmadas
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setBalanceDialogOpen(false)}>
              Cancelar
            </Button>
            <Button className="flex-1" onClick={handleUpdateBalance}>
              Salvar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PersonalDashboard;
