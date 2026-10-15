"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";
type Accent = "orange" | "blue" | "purple" | "green" | "pink";

type ThemeContextType = {
  theme: Theme;
  accent: Accent;
  setTheme: (theme: Theme) => void;
  setAccent: (accent: Accent) => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

const colors: Record<Accent, string> = {
  orange: "#f59e0b",
  blue: "#3b82f6",
  purple: "#a855f7",
  green: "#22c55e",
  pink: "#ec4899",
};

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [accent, setAccent] = useState<Accent>("orange");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("moniq-theme");
    const savedAccent = localStorage.getItem("moniq-accent");

    if (savedTheme === "dark" || savedTheme === "light") {
      setTheme(savedTheme);
    }

    if (
      savedAccent === "orange" ||
      savedAccent === "blue" ||
      savedAccent === "purple" ||
      savedAccent === "green" ||
      savedAccent === "pink"
    ) {
      setAccent(savedAccent);
    }

    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("moniq-theme", theme);
  }, [theme, ready]);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.style.setProperty(
      "--moniq-accent",
      colors[accent]
    );
    localStorage.setItem("moniq-accent", accent);
  }, [accent, ready]);

  return (
    <ThemeContext.Provider
      value={{ theme, accent, setTheme, setAccent }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useMoniqTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useMoniqTheme must be used inside ThemeProvider");
  }

  return context;
}
