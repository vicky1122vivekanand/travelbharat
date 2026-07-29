import { useMemo, useState } from "react";
import { Backpack, Check } from "lucide-react";

const BASE_ITEMS = ["ID proof / passport copies", "Phone charger & power bank", "Reusable water bottle", "First-aid basics", "Cash & cards"];

const CATEGORY_ITEMS = {
  heritage: ["Comfortable walking shoes", "Modest clothing for monuments", "Camera", "Small daypack"],
  nature: ["Insect repellent", "Binoculars", "Lightweight rain jacket", "Trekking shoes"],
  religious: ["Modest, covering clothing", "Scarf/head cover", "Socks (footwear often removed at entry)"],
  adventure: ["Quick-dry clothing", "Sturdy backpack", "Extra socks", "Basic medical kit"],
};

const SEASON_ITEMS = {
  summer: ["Sunscreen (SPF 30+)", "Sunglasses & hat", "Light cotton clothing", "Extra hydration"],
  winter: ["Warm layered clothing", "Thermal wear", "Woolen cap & gloves"],
  monsoon: ["Waterproof jacket/poncho", "Quick-dry clothing", "Waterproof footwear", "Plastic bags for electronics"],
};

export default function PackingChecklist() {
  const [category, setCategory] = useState("heritage");
  const [season, setSeason] = useState("summer");
  const [checked, setChecked] = useState({});

  const items = useMemo(() => {
    const list = [...BASE_ITEMS, ...(CATEGORY_ITEMS[category] || []), ...(SEASON_ITEMS[season] || [])];
    return [...new Set(list)];
  }, [category, season]);

  const toggle = (item) => setChecked((c) => ({ ...c, [item]: !c[item] }));

  return (
    <div className="rounded-sm border border-ink/10 bg-white/50 p-6">
      <h2 className="mb-1 flex items-center gap-2 font-display text-xl text-indigo">
        <Backpack className="h-5 w-5 text-peacock" /> Packing Checklist Generator
      </h2>
      <p className="mb-5 text-sm text-ink/60">Pick a trip type and season to generate a starter packing list.</p>

      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink/60">Trip type</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="input">
            <option value="heritage">Heritage</option>
            <option value="nature">Nature</option>
            <option value="religious">Religious</option>
            <option value="adventure">Adventure</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink/60">Season</label>
          <select value={season} onChange={(e) => setSeason(e.target.value)} className="input">
            <option value="summer">Summer</option>
            <option value="winter">Winter</option>
            <option value="monsoon">Monsoon</option>
          </select>
        </div>
      </div>

      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item}>
            <button
              onClick={() => toggle(item)}
              className="flex w-full items-center gap-2 rounded-sm border border-ink/10 px-3 py-2 text-left text-sm transition-colors hover:border-peacock/50"
            >
              <span
                className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-sm border ${
                  checked[item] ? "border-peacock bg-peacock text-paper" : "border-ink/30"
                }`}
              >
                {checked[item] && <Check className="h-3 w-3" />}
              </span>
              <span className={checked[item] ? "text-ink/40 line-through" : "text-ink/80"}>{item}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
