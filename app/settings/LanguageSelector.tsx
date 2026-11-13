"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const languages = [
  { code: "ru", label: "Русский" },
  { code: "en", label: "English" },
  { code: "lv", label: "Latviešu" },
] as const;

export default function LanguageSelector({ initialLanguage }: { initialLanguage: string }) {
  const router = useRouter();
  const [language, setLanguage] = useState(initialLanguage);
  return (
    <select
      aria-label="Language / Язык / Valoda"
      value={language}
      onChange={(event) => {
        const next = event.target.value;
        setLanguage(next);
        document.cookie = `moniq_language=${next}; Path=/; Max-Age=31536000; SameSite=Lax`;
        document.documentElement.lang = next;
        router.refresh();
      }}
      style={{
        width: "100%", minHeight: 46, padding: "10px 12px", borderRadius: 10,
        border: "1px solid var(--moniq-border)", background: "var(--moniq-input)",
        color: "var(--moniq-text)", fontSize: 16,
      }}
    >
      {languages.map((item) => <option key={item.code} value={item.code}>{item.label}</option>)}
    </select>
  );
}
