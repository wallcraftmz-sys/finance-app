"use client";
import { useMoniqI18n } from "@/lib/moniq-language";
export default function TransactionDateField({
  value,
  onChange,
}: {
  value: string;
  onChange: (date: string) => void;
}) {
  const { msg } = useMoniqI18n();
  return (
    <label className="transaction-date">
      {msg("Дата операции")}
      <span className="transaction-date-control">
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M3 10h18M8 3v4m8-4v4" />
        </svg>
        <input type="date" value={value} onChange={(event) => onChange(event.target.value)} />
      </span>
    </label>
  );
}
