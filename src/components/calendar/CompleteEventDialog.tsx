import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CompleteEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: {
    id: string;
    name: string;
    expectedProfit: number;
  } | null;
  onComplete: (eventId: string, actualProfit: number) => void;
}

const CompleteEventDialog = ({
  open,
  onOpenChange,
  event,
  onComplete,
}: CompleteEventDialogProps) => {
  const { toast } = useToast();
  const [actualProfit, setActualProfit] = useState("");

  const handleComplete = () => {
    if (!event) return;

    if (!actualProfit) {
      toast({
        title: "Campo obrigatório",
        description: "Informe o lucro real obtido",
        variant: "destructive",
      });
      return;
    }

    const profit = parseFloat(actualProfit.replace(",", "."));
    if (isNaN(profit)) {
      toast({
        title: "Valor inválido",
        description: "Informe um valor válido",
        variant: "destructive",
      });
      return;
    }

    onComplete(event.id, profit);
    setActualProfit("");
    onOpenChange(false);

    toast({
      title: "Evento concluído!",
      description: "O lucro real foi registrado como entrada",
    });
  };

  if (!event) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Concluir Evento</DialogTitle>
          <DialogDescription>
            Registre o lucro real obtido no evento
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="bg-accent/50 rounded-xl p-4 space-y-2">
            <p className="text-sm text-muted-foreground">Evento</p>
            <p className="font-semibold text-lg">{event.name}</p>
            <p className="text-sm text-muted-foreground">
              Previsão: R$ {event.expectedProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="actual-profit">Lucro Real Obtido (R$) *</Label>
            <div className="relative">
              <TrendingUp className="absolute left-3 top-3.5 h-5 w-5 text-success" />
              <Input
                id="actual-profit"
                type="text"
                placeholder="0,00"
                value={actualProfit}
                onChange={(e) => setActualProfit(e.target.value)}
                className="rounded-xl h-11 pl-10"
                autoFocus
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Este valor será registrado automaticamente como entrada
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => {
              setActualProfit("");
              onOpenChange(false);
            }}
            className="flex-1 rounded-xl h-11"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleComplete}
            className="flex-1 bg-success hover:bg-success/90 text-success-foreground rounded-xl h-11"
          >
            Registrar Lucro
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CompleteEventDialog;
