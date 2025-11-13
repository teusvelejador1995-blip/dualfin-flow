import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar se há usuário logado
    const storedUser = localStorage.getItem("dualfin_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const signup = async (email: string, password: string, name: string) => {
    // Verificar se usuário já existe
    const users = JSON.parse(localStorage.getItem("dualfin_users") || "{}");
    
    if (users[email]) {
      return { success: false, error: "Email já cadastrado" };
    }

    // Criar novo usuário
    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      name,
    };

    users[email] = { ...newUser, password };
    localStorage.setItem("dualfin_users", JSON.stringify(users));
    
    // Fazer login automático
    localStorage.setItem("dualfin_user", JSON.stringify(newUser));
    setUser(newUser);

    return { success: true };
  };

  const login = async (email: string, password: string) => {
    const users = JSON.parse(localStorage.getItem("dualfin_users") || "{}");
    const userWithPassword = users[email];

    if (!userWithPassword || userWithPassword.password !== password) {
      return { success: false, error: "Email ou senha inválidos" };
    }

    const user: User = {
      id: userWithPassword.id,
      email: userWithPassword.email,
      name: userWithPassword.name,
    };

    localStorage.setItem("dualfin_user", JSON.stringify(user));
    setUser(user);

    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem("dualfin_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
