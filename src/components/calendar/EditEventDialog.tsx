import { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface EditEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: {
    id: string;
    date: Date;
    name: string;
    expectedProfit: number;
    description?: string;
  } | null;
  onSave: (eventId: string, updatedData: {
    date: Date;
    name: string;
    expectedProfit: number;
    description?: string;
  }) => void;
}

const EditEventDialog = ({ open, onOpenChange, event, onSave }: EditEventDialogProps) => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date>();
  const [name, setName] = useState("");
  const [expectedProfit, setExpectedProfit] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (event) {
      setDate(event.date);
      setName(event.name);
      setExpectedProfit(event.expectedProfit.toString().replace(".", ","));
      setDescription(event.description || "");
    }
  }, [event]);

  const handleSave = () => {
    if (!event || !date || !name || !expectedProfit) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha data, nome e previsão de lucro",
        variant: "destructive",
      });
      return;
    }

    const profit = parseFloat(expectedProfit.replace(",", "."));
    if (isNaN(profit) || profit <= 0) {
      toast({
        title: "Valor inválido",
        description: "Informe um valor de lucro válido",
        variant: "destructive",
      });
      return;
    }

    onSave(event.id, {
      date,
      name,
      expectedProfit: profit,
      description,
    });

    onOpenChange(false);

    toast({
      title: "Evento atualizado!",
      description: "As alterações foram salvas com sucesso",
    });
  };

  if (!event) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Editar Evento</DialogTitle>
          <DialogDescription>
            Atualize as informações do evento
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="event-name">Nome do Evento *</Label>
            <Input
              id="event-name"
              placeholder="Ex: Casamento João e Maria"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl h-11"
            />
          </div>

          <div className="space-y-2">
            <Label>Data do Evento *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal rounded-xl h-11",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP", { locale: ptBR }) : "Selecione a data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  className="pointer-events-auto"
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expected-profit">Previsão de Lucro (R$) *</Label>
            <div className="relative">
              <TrendingUp className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
              <Input
                id="expected-profit"
                type="text"
                placeholder="0,00"
                value={expectedProfit}
                onChange={(e) => setExpectedProfit(e.target.value)}
                className="rounded-xl h-11 pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Observações (opcional)</Label>
            <Textarea
              id="description"
              placeholder="Adicione detalhes sobre o evento..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="rounded-xl min-h-[100px] resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 rounded-xl h-11"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-11"
          >
            Salvar Alterações
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditEventDialog;
