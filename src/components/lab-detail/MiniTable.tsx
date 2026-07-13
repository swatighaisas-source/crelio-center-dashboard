interface Props {
  title: string;
  headers: string[];
  rows: string[][];
}

export function MiniTable({ title, headers, rows }: Props) {
  return (
    <div className="detail-card detail-card--compact">
      <h4 className="mini-table__title">{title}</h4>
      <table className="mini-table">
        <thead>
          <tr>
            {headers.map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]}>
              {row.map((cell, i) => (
                <td key={i}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
