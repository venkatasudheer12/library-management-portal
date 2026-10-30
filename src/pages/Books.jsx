import { useMemo, useState } from "react";
import SearchBox from "../components/SearchBox.jsx";
import StatusBadge from "../components/StatusBadge.jsx";

const emptyBook = { title: "", author: "", category: "", isbn: "" };

export default function Books({ books, onSave, onDelete, busy }) {
  const [form, setForm] = useState(emptyBook);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => books.filter((book) =>
    [book.title, book.author, book.category, book.isbn].some((value) =>
      String(value || "").toLowerCase().includes(search.toLowerCase())
    )
  ), [books, search]);

  function startEdit(book) {
    setEditing(book);
    setForm({ title: book.title || "", author: book.author || "", category: book.category || "", isbn: book.isbn || "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submit(e) {
    e.preventDefault();
    await onSave(form, editing);
    setForm(emptyBook);
    setEditing(null);
  }

  return (
    <>
      <div className="page-heading"><div><p className="eyebrow">COLLECTION</p><h1>Books</h1><p className="muted">Manage your library collection.</p></div></div>
      <section className="panel">
        <div className="panel-heading"><div><h2>{editing ? "Edit book" : "Add a book"}</h2><p className="muted">Enter the book details below.</p></div></div>
        <form className="form-grid" onSubmit={submit}>
          {[
            ["title", "Book title"], ["author", "Author"], ["category", "Category"], ["isbn", "ISBN"]
          ].map(([key, label]) => (
            <label key={key} className="field">{label}
              <input value={form[key]} required onChange={(e) => setForm({ ...form, [key]: e.target.value })} placeholder={label} />
            </label>
          ))}
          <div className="form-actions">
            <button className="button button-primary" disabled={busy}>{editing ? "Save changes" : "Add book"}</button>
            {editing && <button type="button" className="button button-secondary" onClick={() => { setEditing(null); setForm(emptyBook); }}>Cancel</button>}
          </div>
        </form>
      </section>
      <section className="panel">
        <div className="panel-heading"><div><h2>All books <span className="sub-count">{books.length}</span></h2><p className="muted">Search and update your records.</p></div><SearchBox value={search} onChange={setSearch} placeholder="Search books..." /></div>
        <div className="table-scroll"><table className="data-table">
          <thead><tr><th>Book title</th><th>Author</th><th>Category</th><th>ISBN</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>{filtered.map((book) => <tr key={book.id}>
            <td className="primary-cell">{book.title}</td><td>{book.author}</td><td>{book.category}</td><td>{book.isbn}</td>
            <td><StatusBadge status={book.status} /></td>
            <td className="actions-cell"><button className="button button-small button-secondary" onClick={() => startEdit(book)}>Edit</button><button className="button button-small button-danger" onClick={() => onDelete(book)}>Delete</button></td>
          </tr>)}</tbody>
        </table>{filtered.length === 0 && <div className="empty-state">No books match your search.</div>}</div>
      </section>
    </>
  );
}