export default function CategoryFilter({ categories, active, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange("")}
        className={`chip ${active === "" ? "chip-active" : ""}`}
      >
        All
      </button>
      {categories.map((c) => (
        <button
          key={c._id}
          onClick={() => onChange(c.slug)}
          className={`chip ${active === c.slug ? "chip-active" : ""}`}
        >
          {c.name}
        </button>
      ))}
    </div>
  );
}
