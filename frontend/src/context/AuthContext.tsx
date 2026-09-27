import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api, setToken, type AdminUser } from "../lib/api";

type AuthContextValue = {
  user: AdminUser | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    api<AdminUser>("/api/auth/me")
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setReady(true));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        ready,
        async login(email, password) {
          const result = await api<{ token: string; user: AdminUser }>("/api/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
          });
          setToken(result.token);
          setUser(result.user);
        },
        async logout() {
          await api("/api/auth/logout", { method: "POST" });
          setToken(null);
          setUser(null);
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
}
