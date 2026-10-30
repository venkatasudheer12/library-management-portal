export default function SearchBox({ value, onChange, placeholder = "Search..." }) {
  return (
    <label className="search-box">
      <span>⌕</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </label>
  );
}