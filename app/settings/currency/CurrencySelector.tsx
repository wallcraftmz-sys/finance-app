"use client";

import { useState } from "react";

const currencies = [
  { code: "EUR", name: "Евро", symbol: "€" },
  { code: "USD", name: "Доллар США", symbol: "$" },
  { code: "GBP", name: "Британский фунт", symbol: "£" },
  { code: "PLN", name: "Польский злотый", symbol: "zł" },
  { code: "SEK", name: "Шведская крона", symbol: "kr" },
  { code: "CHF", name: "Швейцарский франк", symbol: "Fr" },
];

export default function CurrencySelector({
  initialCurrency,
}: {
  initialCurrency: string;
}) {
  const [selected, setSelected] = useState(initialCurrency);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  async function selectCurrency(code: string) {
    if (saving || code === selected) return;

    setSaving(true);
    setMessage("");
    setError(false);

    try {
      const response = await fetch("/api/profile/currency", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currency: code }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ошибка сохранения");
      }

      setSelected(data.currency);
      setMessage("Валюта успешно сохранена");
    } catch (err) {
      setError(true);
      setMessage(
        err instanceof Error ? err.message : "Ошибка сервера"
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <section
        style={{
          background: "var(--moniq-card)",
          borderRadius: 22,
          padding: "8px 18px",
        }}
      >
        {currencies.map((currency, index) => (
          <button
            key={currency.code}
            type="button"
            disabled={saving}
            onClick={() => selectCurrency(currency.code)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              width: "100%",
              padding: "18px 0",
              border: "none",
              borderBottom:
                index === currencies.length - 1
                  ? "none"
                  : "1px solid #34343c",
              background: "transparent",
              color: "var(--moniq-text)",
              textAlign: "left",
              cursor: saving ? "wait" : "pointer",
              opacity: saving ? 0.65 : 1,
            }}
          >
            <span
              style={{
                width: 44,
                height: 44,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "var(--moniq-input)",
                borderRadius: 12,
                color: "var(--moniq-accent)",
                fontSize: 20,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {currency.symbol}
            </span>

            <span style={{ flex: 1 }}>
              <span
                style={{
                  display: "block",
                  fontSize: 16,
                  fontWeight: 700,
                }}
              >
                {currency.code}
              </span>

              <span
                style={{
                  display: "block",
                  color: "var(--moniq-muted)",
                  fontSize: 13,
                  marginTop: 4,
                }}
              >
                {currency.name}
              </span>
            </span>

            {selected === currency.code && (
              <span
                style={{
                  color: "var(--moniq-accent)",
                  fontSize: 22,
                }}
              >
                ✓
              </span>
            )}
          </button>
        ))}
      </section>

      {message && (
        <p
          role="status"
          style={{
            color: error ? "#ff655c" : "#45d6a0",
            fontSize: 14,
            marginTop: 16,
          }}
        >
          {message}
        </p>
      )}

      <p
        style={{
          color: "var(--moniq-muted)",
          fontSize: 12,
          lineHeight: 1.6,
          marginTop: 18,
        }}
      >
        Выбранная валюта сохраняется в вашем аккаунте.
        На главной странице и в аналитике суммы отображаются в выбранной валюте по доступным курсам ECB. Исходная валюта операций сохраняется.
      </p>
    </>
  );
}
