import { useMemo, useState } from "react";
import SearchBox from "../components/SearchBox.jsx";
import TransactionTable from "../components/TransactionTable.jsx";

export default function Transactions({ transactions, onReturn }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const filtered = useMemo(() => transactions.filter((item) => {
    const matchesFilter = filter === "All" || item.status === filter;
    const text = [item.bookTitle, item.memberName, item.status, item.issueDate, item.dueDate].join(" ").toLowerCase();
    return matchesFilter && text.includes(search.toLowerCase());
  }), [transactions, search, filter]);

  return (
    <>
      <div className="page-heading"><div><p className="eyebrow">ACTIVITY</p><h1>Transactions</h1><p className="muted">Review all book issues and returns.</p></div></div>
      <section className="panel">
        <div className="toolbar">
          <div className="filter-tabs">{["All", "Issued", "Returned"].map((status) => <button key={status} className={`filter-tab ${filter === status ? "selected" : ""}`} onClick={() => setFilter(status)}>{status}</button>)}</div>
          <SearchBox value={search} onChange={setSearch} placeholder="Search transactions..." />
        </div>
        <TransactionTable items={[...filtered].reverse()} onReturn={onReturn} />
      </section>
    </>
  );
}