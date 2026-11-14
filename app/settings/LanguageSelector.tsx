"use client";

import { useRouter } from "next/navigation";
import { useMoniqI18n } from "@/lib/moniq-language";

const languages = [
  { code: "ru", label: "Русский" },
  { code: "en", label: "English" },
  { code: "lv", label: "Latviešu" },
] as const;

export default function LanguageSelector() {
  const router = useRouter();
  const { language, msg } = useMoniqI18n();
  return (
    <select
      aria-label={msg("Язык приложения")}
      value={language}
      onChange={(event) => {
        const next = event.target.value;
        document.cookie = `moniq_language=${next}; Path=/; Max-Age=31536000; SameSite=Lax`;
        document.documentElement.lang = next;
        window.dispatchEvent(new Event("moniq-language-change"));
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
