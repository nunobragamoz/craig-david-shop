import { createContext, useContext } from "react";

export const AuthContext = createContext(null);

// Cortar caminho para usar o contexto: const { user, login, logout } = useAuth()
export const useAuth = () => useContext(AuthContext);
