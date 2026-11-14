"use client";
import { createContext, useContext } from "react";
import { moniqI18n, parseMoniqLanguage, type MoniqLanguage } from "./moniq-messages";

export type { MoniqLanguage } from "./moniq-messages";
export function getMoniqLanguage(): MoniqLanguage {
  if (typeof document === "undefined") return "ru";
  const match = document.cookie.match(/(?:^|; )moniq_language=(ru|en|lv)(?:;|$)/)?.[1];
  return parseMoniqLanguage(match);
}
export const MoniqLanguageContext = createContext<MoniqLanguage>("ru");

export function useMoniqLanguage() {
  return useContext(MoniqLanguageContext);
}
export function translate(language: MoniqLanguage, ru: string, en: string, lv: string) {
  return language === "en" ? en : language === "lv" ? lv : ru;
}

export function useMoniqI18n() {
  return moniqI18n(useMoniqLanguage());
}
