import { useState } from "react";
import TransactionTable from "../components/TransactionTable.jsx";

export default function IssueBook({ books, members, transactions, onIssue, onReturn, busy }) {
  const [bookId, setBookId] = useState("");
  const [memberId, setMemberId] = useState("");
  const available = books.filter((book) => book.status !== "Issued");
  const active = transactions.filter((item) => item.status === "Issued");

  async function submit(e) {
    e.preventDefault();
    const ok = await onIssue(bookId, memberId);
    if (ok) { setBookId(""); setMemberId(""); }
  }

  return (
    <>
      <div className="page-heading"><div><p className="eyebrow">CIRCULATION</p><h1>Issue a book</h1><p className="muted">Assign available books to registered members.</p></div></div>
      <section className="panel issue-panel">
        <div className="panel-heading"><div><h2>New loan</h2><p className="muted">The default loan period is 14 days.</p></div></div>
        <form className="form-grid" onSubmit={submit}>
          <label className="field">Select book
            <select value={bookId} onChange={(e) => setBookId(e.target.value)} required>
              <option value="">Choose an available book</option>
              {available.map((book) => <option key={book.id} value={book.id}>{book.title}</option>)}
            </select>
          </label>
          <label className="field">Select member
            <select value={memberId} onChange={(e) => setMemberId(e.target.value)} required>
              <option value="">Choose a member</option>
              {members.map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}
            </select>
          </label>
          <div className="form-actions"><button className="button button-primary" disabled={busy || available.length === 0 || members.length === 0}>Confirm issue</button></div>
        </form>
        {available.length === 0 && <p className="muted">No available books to issue right now.</p>}
      </section>
      <section className="panel"><div className="panel-heading"><div><h2>Active loans</h2><p className="muted">Mark a loan as returned when the book comes back.</p></div><span className="count-pill">{active.length} active</span></div>
        <TransactionTable items={active} onReturn={onReturn} />
      </section>
    </>
  );
}