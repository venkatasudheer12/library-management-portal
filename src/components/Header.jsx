export default function Header({ user }) {
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">LIBRARY MANAGEMENT</p>
        <strong>Manage your library with ease</strong>
      </div>
      <div className="user-pill"><span>●</span> {user}</div>
    </header>
  );
}