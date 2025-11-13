import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

export type TransactionType = "income" | "expense";
export type RecurrenceType = "once" | "monthly" | "yearly";
export type TransactionStatus = "pending" | "confirmed";

export interface Transaction {
  id: string;
  userId: string;
  mode: "personal" | "business";
  type: TransactionType;
  value: number;
  date: string;
  description: string;
  recurrence: RecurrenceType;
  status: TransactionStatus;
  observations?: string;
  createdAt: string;
}

export interface CalendarEvent {
  id: string;
  userId: string;
  name: string;
  date: string;
  expectedProfit: number;
  actualProfit?: number;
  completed: boolean;
  description?: string;
  createdAt: string;
}

export interface Balance {
  userId: string;
  mode: "personal" | "business";
  currentBalance: number;
}

interface DataContextType {
  // Transactions
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, "id" | "userId" | "createdAt">) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  
  // Calendar Events
  events: CalendarEvent[];
  addEvent: (event: Omit<CalendarEvent, "id" | "userId" | "completed" | "createdAt">) => void;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;
  completeEvent: (id: string, actualProfit: number) => void;
  
  // Balance
  getBalance: (mode: "personal" | "business") => number;
  setBalance: (mode: "personal" | "business", balance: number) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [balances, setBalances] = useState<Balance[]>([]);

  // Carregar dados do localStorage quando o usuário logar
  useEffect(() => {
    if (user) {
      const storedTransactions = localStorage.getItem(`dualfin_transactions_${user.id}`);
      const storedEvents = localStorage.getItem(`dualfin_events_${user.id}`);
      const storedBalances = localStorage.getItem(`dualfin_balances_${user.id}`);

      if (storedTransactions) setTransactions(JSON.parse(storedTransactions));
      if (storedEvents) setEvents(JSON.parse(storedEvents));
      if (storedBalances) setBalances(JSON.parse(storedBalances));
    } else {
      setTransactions([]);
      setEvents([]);
      setBalances([]);
    }
  }, [user]);

  // Salvar dados no localStorage sempre que mudarem
  useEffect(() => {
    if (user) {
      localStorage.setItem(`dualfin_transactions_${user.id}`, JSON.stringify(transactions));
    }
  }, [transactions, user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`dualfin_events_${user.id}`, JSON.stringify(events));
    }
  }, [events, user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`dualfin_balances_${user.id}`, JSON.stringify(balances));
    }
  }, [balances, user]);

  const addTransaction = (transaction: Omit<Transaction, "id" | "userId" | "createdAt">) => {
    if (!user) return;

    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
      userId: user.id,
      createdAt: new Date().toISOString(),
    };

    setTransactions((prev) => [...prev, newTransaction]);
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const addEvent = (event: Omit<CalendarEvent, "id" | "userId" | "completed" | "createdAt">) => {
    if (!user) return;

    const newEvent: CalendarEvent = {
      ...event,
      id: crypto.randomUUID(),
      userId: user.id,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setEvents((prev) => [...prev, newEvent]);
  };

  const updateEvent = (id: string, updates: Partial<CalendarEvent>) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
  };

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const completeEvent = (id: string, actualProfit: number) => {
    const event = events.find((e) => e.id === id);
    if (!event || !user) return;

    // Marcar evento como completo
    setEvents((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, completed: true, actualProfit } : e
      )
    );

    // Criar transação automática de entrada confirmada
    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      userId: user.id,
      mode: "personal",
      type: "income",
      value: actualProfit,
      date: event.date,
      description: `Lucro do evento: ${event.name}`,
      recurrence: "once",
      status: "confirmed",
      observations: `Gerado automaticamente pelo evento ${event.name}`,
      createdAt: new Date().toISOString(),
    };

    setTransactions((prev) => [...prev, newTransaction]);
  };

  const getBalance = (mode: "personal" | "business") => {
    if (!user) return 0;

    const balance = balances.find((b) => b.userId === user.id && b.mode === mode);
    return balance?.currentBalance || 0;
  };

  const setBalance = (mode: "personal" | "business", balance: number) => {
    if (!user) return;

    setBalances((prev) => {
      const existing = prev.find((b) => b.userId === user.id && b.mode === mode);
      if (existing) {
        return prev.map((b) =>
          b.userId === user.id && b.mode === mode
            ? { ...b, currentBalance: balance }
            : b
        );
      } else {
        return [...prev, { userId: user.id, mode, currentBalance: balance }];
      }
    });
  };

  return (
    <DataContext.Provider
      value={{
        transactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        events,
        addEvent,
        updateEvent,
        deleteEvent,
        completeEvent,
        getBalance,
        setBalance,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
