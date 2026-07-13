import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext(null);

// Stellt im gesamten Projekt zur Verfügung, ob gerade der Administrator
// eingeloggt ist, plus Funktionen zum Ein- und Ausloggen.
export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  async function login(username, password) {
    // Der "Benutzername" wird intern als E-Mail behandelt (Supabase Auth
    // arbeitet mit E-Mail-Adressen). Siehe README.md, "Admin-Zugang einrichten".
    const email = username.includes("@") ? username : `${username}@login.local`;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }

  async function logout() {
    await supabase.auth.signOut();
  }

  const value = {
    isAdmin: !!session,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
