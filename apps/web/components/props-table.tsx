export interface PropRow {
  name: string;
  type: string;
  default?: string;
  description: string;
}

export function PropsTable({ rows }: { rows: PropRow[] }) {
  return (
    <div className="not-prose my-6 overflow-x-auto rounded-lg border border-fd-border">
      <table className="w-full text-sm">
        <caption className="sr-only">Props</caption>
        <thead>
          <tr className="bg-fd-muted/50 text-start">
            {["Prop", "Type", "Default", "Description"].map((h) => (
              <th key={h} scope="col" className="px-3 py-2 text-start font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name} className="border-t border-fd-border align-top">
              <th scope="row" className="px-3 py-2 text-start font-mono text-xs font-medium">
                {row.name}
              </th>
              <td className="px-3 py-2 font-mono text-xs">{row.type}</td>
              <td className="px-3 py-2 font-mono text-xs">{row.default ?? "–"}</td>
              <td className="px-3 py-2">{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
