type Props = {
  month: string;
  setMonth: (month: string) => void;
  group: string;
  setGroup: (group: string) => void;
  groups: string[];
  groupLabel: string;
};

export default function TransactionFilters({
  month, setMonth, group, setGroup, groups, groupLabel,
}: Props) {
  return (
    <div className="transaction-filters">
      <label>
        Месяц
        <input type="month" value={month} onChange={(event) => setMonth(event.target.value)} />
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
