import { cn } from "@/utils";

interface Column<T> {
  key:        string;
  header:     string;
  render?:    (row: T) => React.ReactNode;
  className?: string;
}

interface TableProps<T> {
  columns:        Column<T>[];
  data:           T[];
  className?:     string;
  emptyMessage?:  string;
}

export function Table<T extends Record<string, unknown>>({
  columns, data, className, emptyMessage = "No data found",
}: TableProps<T>) {
  return (
    <div className={cn("overflow-x-auto rounded-xl border border-slate-200 shadow-sm", className)}>
      <table className="w-full text-sm">
        <thead className="border-b border-slate-200 bg-slate-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn("px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500", col.className)}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-10 text-center text-sm text-slate-400">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr key={i} className="hover:bg-slate-50 transition-colors duration-100">
                {columns.map((col) => (
                  <td key={col.key} className={cn("px-4 py-3 text-slate-700", col.className)}>
                    {col.render ? col.render(row) : String(row[col.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}