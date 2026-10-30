import { useMemo, useState } from "react";
import SearchBox from "../components/SearchBox.jsx";

const emptyMember = { name: "", email: "", phone: "" };

export default function Members({ members, onSave, onDelete, busy }) {
  const [form, setForm] = useState(emptyMember);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => members.filter((member) =>
    [member.name, member.email, member.phone].some((value) =>
      String(value || "").toLowerCase().includes(search.toLowerCase())
    )
  ), [members, search]);

  function startEdit(member) {
    setEditing(member);
    setForm({ name: member.name || "", email: member.email || "", phone: member.phone || "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submit(e) {
    e.preventDefault();
    await onSave(form, editing);
    setForm(emptyMember);
    setEditing(null);
  }

  return (
    <>
      <div className="page-heading"><div><p className="eyebrow">PEOPLE</p><h1>Members</h1><p className="muted">Manage registered library members.</p></div></div>
      <section className="panel">
        <div className="panel-heading"><div><h2>{editing ? "Edit member" : "Add a member"}</h2><p className="muted">Keep member contact details up to date.</p></div></div>
        <form className="form-grid" onSubmit={submit}>
          <label className="field">Full name<input value={form.name} required onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" /></label>
          <label className="field">Email address<input type="email" value={form.email} required onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="name@example.com" /></label>
          <label className="field">Phone number<input value={form.phone} required onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone number" /></label>
          <div className="form-actions"><button className="button button-primary" disabled={busy}>{editing ? "Save changes" : "Add member"}</button>
            {editing && <button type="button" className="button button-secondary" onClick={() => { setEditing(null); setForm(emptyMember); }}>Cancel</button>}
          </div>
        </form>
      </section>
      <section className="panel">
        <div className="panel-heading"><div><h2>All members <span className="sub-count">{members.length}</span></h2><p className="muted">Search and manage member records.</p></div><SearchBox value={search} onChange={setSearch} placeholder="Search members..." /></div>
        <div className="table-scroll"><table className="data-table">
          <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Actions</th></tr></thead>
          <tbody>{filtered.map((member) => <tr key={member.id}>
            <td className="primary-cell">{member.name}</td><td>{member.email}</td><td>{member.phone}</td>
            <td className="actions-cell"><button className="button button-small button-secondary" onClick={() => startEdit(member)}>Edit</button><button className="button button-small button-danger" onClick={() => onDelete(member)}>Delete</button></td>
          </tr>)}</tbody>
        </table>{filtered.length === 0 && <div className="empty-state">No members match your search.</div>}</div>
      </section>
    </>
  );
}