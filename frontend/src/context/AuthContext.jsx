import { useEffect, useState } from "react";
import { api } from "../services/api";
import { AuthContext } from "./auth-context";

// Mantém o estado do utilizador logado, e funções para login, logout e registo
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true até o PHP responder em me.php

  // Quando o aplicativo carrega, pergunta ao PHP quem é o utilizador logado (se houver algum)
  useEffect(() => {
    api("auth/me.php")
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const data = await api("auth/login.php", {
      method: "POST",
      body: { email, password },
    });
    setUser(data);
    return data;
  }

  async function register(nome, email, password) {
    const data = await api("auth/register.php", {
      method: "POST",
      body: { nome, email, password },
    });
    setUser(data);
    return data;
  }

  async function logout() {
    await api("auth/logout.php", { method: "POST" });
    setUser(null);
  }

  const isAdmin = user?.tipo_utilizador === "admin";

  return (
    <AuthContext.Provider
      value={{ user, setUser, isAdmin, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
