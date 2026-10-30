import StatusBadge from "./StatusBadge.jsx";

export default function TransactionTable({ items, onReturn }) {
  return (
    <div className="table-scroll">
      <table className="data-table">
        <thead>
          <tr>
            <th>Book</th><th>Member</th><th>Issue date</th><th>Due date</th>
            <th>Return date</th><th>Status</th><th>Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td className="primary-cell">{item.bookTitle || "—"}</td>
              <td>{item.memberName || "—"}</td>
              <td>{item.issueDate || "—"}</td>
              <td>{item.dueDate || "—"}</td>
              <td>{item.returnDate || "—"}</td>
              <td><StatusBadge status={item.status} /></td>
              <td>{item.status === "Issued"
                ? <button className="button button-small" onClick={() => onReturn(item)}>Return</button>
                : <span className="muted">—</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {items.length === 0 && <div className="empty-state">No records to display.</div>}
    </div>
  );
}