import StatCard from "../components/StatCard.jsx";
import TransactionTable from "../components/TransactionTable.jsx";

export default function Dashboard({ books, members, transactions, onReturn, onNavigate }) {
  const issued = books.filter((book) => book.status === "Issued").length;
  const available = books.length - issued;
  const activeTransactions = transactions.filter((item) => item.status === "Issued");

  return (
    <>
      <div className="page-heading">
        <div><p className="eyebrow">OVERVIEW</p><h1>Dashboard</h1><p className="muted">Here is what is happening in your library today.</p></div>
        <button className="button button-primary" onClick={() => onNavigate("Issue Book")}>＋ Issue a book</button>
      </div>
      <div className="stats-grid">
        <StatCard title="Total books" value={books.length} icon="▤" tone="green" />
        <StatCard title="Available books" value={available} icon="✓" tone="blue" />
        <StatCard title="Currently issued" value={issued} icon="↗" tone="orange" />
        <StatCard title="Registered members" value={members.length} icon="♙" tone="purple" />
      </div>
      <section className="panel">
        <div className="panel-heading"><div><h2>Active loans</h2><p className="muted">Books that have not been returned yet</p></div><span className="count-pill">{activeTransactions.length} active</span></div>
        <TransactionTable items={activeTransactions} onReturn={onReturn} />
      </section>
    </>
  );
}