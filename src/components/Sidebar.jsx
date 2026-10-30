const items = [
  ["Dashboard", "▦"],
  ["Books", "▤"],
  ["Members", "♙"],
  ["Issue Book", "↗"],
  ["Transactions", "↻"]
];

export default function Sidebar({ page, setPage, user, onLogout }) {
  return (
    <aside className="sidebar">
      <div className="brand"><span className="brand-icon">▣</span> Library Portal</div>
      <p className="sidebar-label">MAIN MENU</p>
      <nav className="nav-list">
        {items.map(([label, icon]) => (
          <button
            key={label}
            className={`nav-item ${page === label ? "active" : ""}`}
            onClick={() => setPage(label)}
          >
            <span className="nav-icon">{icon}</span>{label}
          </button>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <div className="sidebar-user">Signed in as<br /><strong>{user}</strong></div>
        <button className="logout-button" onClick={onLogout}>Log out</button>
      </div>
    </aside>
  );
}