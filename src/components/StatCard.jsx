export default function StatCard({ title, value, icon, tone = "" }) {
  return (
    <article className="stat-card">
      <div className={`stat-icon ${tone}`}>{icon}</div>
      <p>{title}</p>
      <strong>{value}</strong>
    </article>
  );
}