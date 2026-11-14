"use client";

import { useEffect, useState, type ReactNode } from "react";
import { MoniqLanguageContext, getMoniqLanguage, type MoniqLanguage } from "@/lib/moniq-language";

export default function MoniqLanguageProvider({
  children,
  initialLanguage,
}: {
  children: ReactNode;
  initialLanguage: MoniqLanguage;
}) {
  const [language, setLanguage] = useState(initialLanguage);

  useEffect(() => {
    const update = () => setLanguage(getMoniqLanguage());
    update();
    window.addEventListener("moniq-language-change", update);
    window.addEventListener("focus", update);
    return () => {
      window.removeEventListener("moniq-language-change", update);
      window.removeEventListener("focus", update);
    };
  }, [initialLanguage]);

  return (
    <MoniqLanguageContext.Provider value={language}>
      {children}
    </MoniqLanguageContext.Provider>
  );
}
