export default function StatusBadge({ status }) {
  const kind = status === "Issued" ? "issued" : status === "Returned" ? "returned" : "available";
  return <span className={`status-badge ${kind}`}>{status || "Available"}</span>;
}