import type { ReactNode } from "react";

export function StatTile({ label, value, hint }: { label: string; value: number; hint: string }) {
  return (
    <div className="zuri-glass rounded-lg p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-3xl font-semibold tabular-nums">
        {value.toLocaleString("en-US")}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

/** A real table: it is both the visual and the accessible alternative to any chart. */
export function DataTable({
  caption,
  headers,
  rows,
  empty = "No data yet.",
}: {
  caption: string;
  headers: string[];
  rows: ReactNode[][];
  empty?: string;
}) {
  return (
    <section className="zuri-glass relative overflow-x-auto rounded-lg">
      <table className="w-full text-sm">
        <caption className="px-4 pt-4 text-start font-display text-base font-semibold">
          {caption}
        </caption>
        <thead>
          <tr className="text-start text-muted-foreground">
            {headers.map((h, i) => (
              <th
                key={h}
                scope="col"
                className={`px-4 py-2 font-medium ${i ? "text-end" : "text-start"}`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={headers.length} className="px-4 pb-4 text-muted-foreground">
                {empty}
              </td>
            </tr>
          ) : (
            rows.map((cells) => (
              <tr key={String(cells[0])} className="border-t border-border">
                {cells.map((cell, i) => (
                  <td
                    key={headers[i]}
                    className={`px-4 py-2 ${i ? "text-end tabular-nums" : "text-start font-mono text-xs"}`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </section>
  );
}
