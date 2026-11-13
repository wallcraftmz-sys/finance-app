"use client";
import { useEffect, useState } from "react";

export type MoniqLanguage = "ru" | "en" | "lv";
export function getMoniqLanguage(): MoniqLanguage {
  if (typeof document === "undefined") return "ru";
  const match = document.cookie.match(/(?:^|; )moniq_language=(ru|en|lv)(?:;|$)/)?.[1];
  return match === "en" || match === "lv" ? match : "ru";
}
export function useMoniqLanguage(): MoniqLanguage {
  const [language, setLanguage] = useState<MoniqLanguage>("ru");
  useEffect(() => {
    setLanguage(getMoniqLanguage());
    const update = () => setLanguage(getMoniqLanguage());
    window.addEventListener("moniq-language-change", update);
    return () => window.removeEventListener("moniq-language-change", update);
  }, []);
  return language;
}
export function translate(language: MoniqLanguage, ru: string, en: string, lv: string) {
  return language === "en" ? en : language === "lv" ? lv : ru;
}
