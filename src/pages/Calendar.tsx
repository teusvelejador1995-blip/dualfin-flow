import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, Plus, Calendar as CalendarIcon, Check, Clock, TrendingUp, MoreVertical, Edit, Trash2, CalendarRange } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format, isSameDay, isSameMonth, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";
import EventDialog from "@/components/calendar/EventDialog";
import EditEventDialog from "@/components/calendar/EditEventDialog";
import CompleteEventDialog from "@/components/calendar/CompleteEventDialog";
import YearView from "@/components/calendar/YearView";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useData } from "@/contexts/DataContext";

const Calendar = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { events: dataEvents, addEvent, updateEvent, deleteEvent, completeEvent } = useData();
  const [viewMode, setViewMode] = useState<"month" | "year">("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  // Converter eventos do contexto para o formato do calendário
  const events = useMemo(() => {
    return dataEvents.map((e) => ({
      ...e,
      date: new Date(e.date),
    }));
  }, [dataEvents]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { locale: ptBR });
  const calendarEnd = endOfWeek(monthEnd, { locale: ptBR });
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const handleSaveEvent = (eventData: {
    date: Date;
    name: string;
    expectedProfit: number;
    description?: string;
  }) => {
    addEvent({
      date: eventData.date.toISOString(),
      name: eventData.name,
      expectedProfit: eventData.expectedProfit,
      description: eventData.description,
    });
    
    toast({
      title: "Evento criado!",
      description: "O evento foi adicionado ao calendário",
    });
  };

  const handleEditEvent = (eventId: string, updatedData: {
    date: Date;
    name: string;
    expectedProfit: number;
    description?: string;
  }) => {
    updateEvent(eventId, {
      date: updatedData.date.toISOString(),
      name: updatedData.name,
      expectedProfit: updatedData.expectedProfit,
      description: updatedData.description,
    });
    
    toast({
      title: "Evento atualizado!",
      description: "As alterações foram salvas",
    });
  };

  const handleDeleteEvent = () => {
    if (!selectedEvent) return;
    
    deleteEvent(selectedEvent.id);
    setDeleteDialogOpen(false);
    setSelectedEvent(null);
    
    toast({
      title: "Evento excluído",
      description: "O evento foi removido do calendário",
    });
  };

  const handleCompleteEvent = (eventId: string, actualProfit: number) => {
    completeEvent(eventId, actualProfit);
    
    toast({
      title: "Evento finalizado!",
      description: "O lucro foi registrado e uma entrada foi criada automaticamente",
    });
  };

  const getEventsForDay = (day: Date) => {
    return events.filter(event => isSameDay(event.date, day));
  };

  const upcomingEvents = events
    .filter(e => !e.completed && e.date >= new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5);

  const totalExpectedProfit = events
    .filter(e => !e.completed)
    .reduce((sum, e) => sum + e.expectedProfit, 0);

  const totalRealizedProfit = events
    .filter(e => e.completed && e.actualProfit)
    .reduce((sum, e) => sum + (e.actualProfit || 0), 0);

  const handleMonthClick = (month: Date) => {
    setCurrentDate(month);
    setViewMode("month");
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/dashboard/personal")}
              className="rounded-xl"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                Calendário de Eventos
              </h1>
              <p className="text-muted-foreground mt-1">
                Organize seus eventos e acompanhe os lucros
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button
              onClick={() => setViewMode(viewMode === "month" ? "year" : "month")}
              variant="outline"
              className="rounded-xl shadow-[var(--shadow-soft)] hover:shadow-lg transition-all duration-300"
            >
              <CalendarRange className="w-5 h-5 mr-2" />
              {viewMode === "month" ? "Visão Anual" : "Visão Mensal"}
            </Button>
            <Button
              onClick={() => setEventDialogOpen(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-[var(--shadow-soft)] hover:shadow-lg transition-all duration-300"
            >
              <Plus className="w-5 h-5 mr-2" />
              Novo Evento
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
          <Card className="p-6 rounded-2xl shadow-[var(--shadow-card)] border-border">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-primary" />
              </div>
            </div>
            <p className="text-muted-foreground text-sm mb-2">Eventos Pendentes</p>
            <p className="text-3xl font-bold text-card-foreground">
              {events.filter(e => !e.completed).length}
            </p>
          </Card>

          <Card className="p-6 rounded-2xl shadow-[var(--shadow-card)] border-border">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-accent-foreground" />
              </div>
            </div>
            <p className="text-muted-foreground text-sm mb-2">Lucro Previsto</p>
            <p className="text-3xl font-bold text-card-foreground">
              R$ {totalExpectedProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </Card>

          <Card className="p-6 rounded-2xl shadow-[var(--shadow-card)] border-border bg-gradient-to-br from-success to-success/80">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-success-foreground/20 flex items-center justify-center">
                <Check className="w-6 h-6 text-success-foreground" />
              </div>
            </div>
            <p className="text-success-foreground/80 text-sm mb-2">Lucro Realizado</p>
            <p className="text-3xl font-bold text-success-foreground">
              R$ {totalRealizedProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </Card>
        </div>

        {viewMode === "year" ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
            <YearView
              currentYear={currentDate}
              events={events}
              onMonthClick={handleMonthClick}
            />
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Calendar */}
            <Card className="lg:col-span-2 p-6 rounded-2xl shadow-[var(--shadow-card)] border-border animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-card-foreground">
                  {format(currentDate, "MMMM 'de' yyyy", { locale: ptBR })}
                </h2>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                    className="rounded-xl"
                  >
                    ←
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentDate(new Date())}
                    className="rounded-xl"
                  >
                    Hoje
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                    className="rounded-xl"
                  >
                    →
                  </Button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="space-y-2">
                {/* Week days */}
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
                    <div
                      key={day}
                      className="text-center text-sm font-semibold text-muted-foreground py-2"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar days */}
                <div className="grid grid-cols-7 gap-2">
                  {calendarDays.map((day, index) => {
                    const dayEvents = getEventsForDay(day);
                    const isCurrentMonth = isSameMonth(day, currentDate);
                    const isToday = isSameDay(day, new Date());

                    return (
                      <div
                        key={index}
                        className={cn(
                          "min-h-[80px] p-2 rounded-xl border transition-all duration-200",
                          isCurrentMonth ? "bg-card border-border" : "bg-muted/30 border-transparent",
                          isToday && "ring-2 ring-primary",
                          dayEvents.length > 0 && "hover:shadow-md cursor-pointer"
                        )}
                      >
                        <p className={cn(
                          "text-sm font-semibold mb-1",
                          isCurrentMonth ? "text-card-foreground" : "text-muted-foreground",
                          isToday && "text-primary"
                        )}>
                          {format(day, "d")}
                        </p>
                        <div className="space-y-1">
                          {dayEvents.map((event) => (
                            <div key={event.id} className="relative group">
                              <button
                                onClick={() => {
                                  if (!event.completed) {
                                    setSelectedEvent(event);
                                    setCompleteDialogOpen(true);
                                  }
                                }}
                                className={cn(
                                  "w-full text-left text-xs p-1.5 pr-7 rounded transition-colors",
                                  event.completed
                                    ? "bg-success/20 text-success line-through"
                                    : "bg-primary/20 text-primary hover:bg-primary/30"
                                )}
                              >
                                {event.name}
                              </button>
                              
                              {!event.completed && (
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <button
                                      className="absolute right-1 top-1 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-background/80 rounded"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <MoreVertical className="w-3 h-3" />
                                    </button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="rounded-xl">
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setSelectedEvent(event);
                                        setEditDialogOpen(true);
                                      }}
                                      className="rounded-lg cursor-pointer"
                                    >
                                      <Edit className="w-4 h-4 mr-2" />
                                      Editar
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setSelectedEvent(event);
                                        setDeleteDialogOpen(true);
                                      }}
                                      className="rounded-lg cursor-pointer text-destructive focus:text-destructive"
                                    >
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      Excluir
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>

            {/* Upcoming Events */}
            <Card className="p-6 rounded-2xl shadow-[var(--shadow-card)] border-border animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
              <h2 className="text-xl font-bold text-card-foreground mb-6 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-primary" />
                Próximos Eventos
              </h2>
              
              <div className="space-y-3">
                {upcomingEvents.length === 0 ? (
                  <p className="text-muted-foreground text-sm text-center py-8">
                    Nenhum evento agendado
                  </p>
                ) : (
                  upcomingEvents.map((event) => (
                    <div key={event.id} className="relative group">
                      <button
                        onClick={() => {
                          setSelectedEvent(event);
                          setCompleteDialogOpen(true);
                        }}
                        className="w-full p-4 pr-12 rounded-xl bg-muted/50 hover:bg-muted transition-all duration-200 text-left"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <p className="font-semibold text-card-foreground group-hover:text-primary transition-colors">
                            {event.name}
                          </p>
                          <Clock className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {format(event.date, "dd 'de' MMMM", { locale: ptBR })}
                        </p>
                        <p className="text-sm font-semibold text-primary">
                          Previsão: R$ {event.expectedProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      </button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-background rounded-lg">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedEvent(event);
                              setEditDialogOpen(true);
                            }}
                            className="rounded-lg cursor-pointer"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedEvent(event);
                              setDeleteDialogOpen(true);
                            }}
                            className="rounded-lg cursor-pointer text-destructive focus:text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Dialogs */}
        <EventDialog
          open={eventDialogOpen}
          onOpenChange={setEventDialogOpen}
          onSave={handleSaveEvent}
        />

        {selectedEvent && (
          <>
            <EditEventDialog
              open={editDialogOpen}
              onOpenChange={setEditDialogOpen}
              event={selectedEvent}
              onSave={handleEditEvent}
            />

            <CompleteEventDialog
              open={completeDialogOpen}
              onOpenChange={setCompleteDialogOpen}
              event={selectedEvent}
              onComplete={handleCompleteEvent}
            />
          </>
        )}

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent className="rounded-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir evento?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação não pode ser desfeita. O evento será permanentemente removido do calendário.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteEvent}
                className="rounded-xl bg-destructive hover:bg-destructive/90"
              >
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Calendar;
