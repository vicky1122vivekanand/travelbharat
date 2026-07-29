import { UtensilsCrossed } from "lucide-react";

export default function CuisineHighlights({ cuisine }) {
  if (!cuisine?.length) return null;

  return (
    <div className="mb-10">
      <h2 className="mb-4 flex items-center gap-2 font-display text-xl text-indigo">
        <UtensilsCrossed className="h-5 w-5 text-maroon" /> Local Cuisine to Try
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cuisine.map((c, i) => (
          <div key={i} className="overflow-hidden rounded-sm border border-ink/10 bg-white/50">
            {c.image && <img src={c.image} alt={c.name} className="h-32 w-full object-cover" />}
            <div className="p-4">
              <h3 className="font-display text-base text-indigo">{c.name}</h3>
              <p className="mt-1 text-sm text-ink/70">{c.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
