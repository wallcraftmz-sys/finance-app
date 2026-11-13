type Props = {
  month: string;
  months: string[];
  setMonth: (month: string) => void;
  group: string;
  setGroup: (group: string) => void;
  groups: string[];
  groupLabel: string;
};

export default function TransactionFilters({
  month, months, setMonth, group, setGroup, groups, groupLabel,
}: Props) {
  return (
    <div className="transaction-filters">
      <label>
        Месяц
        <span className="transaction-month">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <path d="M3 10h18M8 3v4m8-4v4" />
          </svg>
          <select value={month} onChange={(event) => setMonth(event.target.value)}>
            <option value="">Все месяцы</option>
            {months.map((value) => (
              <option key={value} value={value}>
                {new Intl.DateTimeFormat("ru-RU", { month: "long", year: "numeric", timeZone: "UTC" })
                  .format(new Date(`${value}-01T00:00:00Z`))}
              </option>
            ))}
          </select>
        </span>
      </label>
      <label>
        {groupLabel}
        <select value={group} onChange={(event) => setGroup(event.target.value)}>
          <option value="">Все</option>
          {groups.map((value) => <option key={value}>{value}</option>)}
        </select>
      </label>
      {(month || group) && (
        <button type="button" onClick={() => { setMonth(""); setGroup(""); }}>
          Сбросить фильтры
        </button>
      )}
    </div>
  );
}
