import { Card } from "@/components/ui/card";
import { TrendingUp, Check, Clock, Calendar } from "lucide-react";
import { format, startOfYear, endOfYear, eachMonthOfInterval, isSameMonth } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CalendarEvent {
  id: string;
  date: Date;
  name: string;
  expectedProfit: number;
  actualProfit?: number;
  description?: string;
  completed: boolean;
}

interface YearViewProps {
  currentYear: Date;
  events: CalendarEvent[];
  onMonthClick: (month: Date) => void;
}

const YearView = ({ currentYear, events, onMonthClick }: YearViewProps) => {
  const yearStart = startOfYear(currentYear);
  const yearEnd = endOfYear(currentYear);
  const months = eachMonthOfInterval({ start: yearStart, end: yearEnd });

  const getMonthStats = (month: Date) => {
    const monthEvents = events.filter(event => isSameMonth(event.date, month));
    const pending = monthEvents.filter(e => !e.completed);
    const completed = monthEvents.filter(e => e.completed);
    
    const expectedProfit = pending.reduce((sum, e) => sum + e.expectedProfit, 0);
    const realizedProfit = completed.reduce((sum, e) => sum + (e.actualProfit || 0), 0);
    
    return {
      total: monthEvents.length,
      pending: pending.length,
      completed: completed.length,
      expectedProfit,
      realizedProfit,
    };
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          {format(currentYear, "yyyy")}
        </h2>
        <p className="text-muted-foreground">
          Visão anual dos eventos e lucros
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {months.map((month) => {
          const stats = getMonthStats(month);
          const hasEvents = stats.total > 0;

          return (
            <button
              key={month.toISOString()}
              onClick={() => onMonthClick(month)}
              className="text-left transition-all duration-300 hover:-translate-y-1"
            >
              <Card className={`p-5 rounded-2xl shadow-[var(--shadow-card)] border-border hover:shadow-[var(--shadow-soft)] transition-all duration-300 ${
                hasEvents ? "hover:border-primary/50" : ""
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-card-foreground capitalize">
                    {format(month, "MMMM", { locale: ptBR })}
                  </h3>
                  <Calendar className={`w-5 h-5 ${hasEvents ? "text-primary" : "text-muted-foreground"}`} />
                </div>

                {hasEvents ? (
                  <div className="space-y-3">
                    {/* Event counts */}
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <span className="text-muted-foreground">{stats.pending} pendente{stats.pending !== 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-success"></div>
                        <span className="text-muted-foreground">{stats.completed} concluído{stats.completed !== 1 ? 's' : ''}</span>
                      </div>
                    </div>

                    {/* Expected profit */}
                    {stats.expectedProfit > 0 && (
                      <div className="bg-accent/50 rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="w-4 h-4 text-primary" />
                          <p className="text-xs text-muted-foreground">Previsto</p>
                        </div>
                        <p className="text-sm font-bold text-primary">
                          R$ {stats.expectedProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    )}

                    {/* Realized profit */}
                    {stats.realizedProfit > 0 && (
                      <div className="bg-success/10 rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Check className="w-4 h-4 text-success" />
                          <p className="text-xs text-muted-foreground">Realizado</p>
                        </div>
                        <p className="text-sm font-bold text-success">
                          R$ {stats.realizedProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      Nenhum evento
                    </p>
                  </div>
                )}
              </Card>
            </button>
          );
        })}
      </div>

      {/* Year totals */}
      <div className="grid md:grid-cols-3 gap-4 mt-8">
        <Card className="p-5 rounded-2xl shadow-[var(--shadow-card)] border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total de Eventos</p>
              <p className="text-2xl font-bold text-card-foreground">{events.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-5 rounded-2xl shadow-[var(--shadow-card)] border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-accent-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Lucro Previsto</p>
              <p className="text-2xl font-bold text-card-foreground">
                R$ {events.filter(e => !e.completed).reduce((sum, e) => sum + e.expectedProfit, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-5 rounded-2xl shadow-[var(--shadow-card)] border-border bg-gradient-to-br from-success to-success/80">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-success-foreground/20 flex items-center justify-center">
              <Check className="w-5 h-5 text-success-foreground" />
            </div>
            <div>
              <p className="text-sm text-success-foreground/80">Lucro Realizado</p>
              <p className="text-2xl font-bold text-success-foreground">
                R$ {events.filter(e => e.completed && e.actualProfit).reduce((sum, e) => sum + (e.actualProfit || 0), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default YearView;
