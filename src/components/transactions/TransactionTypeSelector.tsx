import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";

interface TransactionTypeSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectType: (type: "income" | "expense") => void;
}

export const TransactionTypeSelector = ({
  open,
  onOpenChange,
  onSelectType,
}: TransactionTypeSelectorProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Nova Transação</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <Button
            variant="outline"
            className="h-auto py-6 flex flex-col items-center gap-2 hover:border-success hover:bg-success/5"
            onClick={() => {
              onSelectType("income");
              onOpenChange(false);
            }}
          >
            <ArrowUpCircle className="w-8 h-8 text-success" />
            <div className="text-center">
              <div className="font-semibold">Cadastrar Entrada</div>
              <div className="text-xs text-muted-foreground">
                Registrar receita ou ganho
              </div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="h-auto py-6 flex flex-col items-center gap-2 hover:border-destructive hover:bg-destructive/5"
            onClick={() => {
              onSelectType("expense");
              onOpenChange(false);
            }}
          >
            <ArrowDownCircle className="w-8 h-8 text-destructive" />
            <div className="text-center">
              <div className="font-semibold">Cadastrar Saída (Despesa)</div>
              <div className="text-xs text-muted-foreground">
                Registrar gasto ou despesa
              </div>
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
