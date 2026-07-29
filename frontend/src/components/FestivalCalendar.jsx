import { PartyPopper } from "lucide-react";

export default function FestivalCalendar({ festivals }) {
  if (!festivals?.length) return null;

  return (
    <div className="mb-10">
      <h2 className="mb-4 flex items-center gap-2 font-display text-xl text-indigo">
        <PartyPopper className="h-5 w-5 text-marigold" /> Festivals &amp; Events
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {festivals.map((f) => (
          <div key={f._id} className="rounded-sm border border-ink/10 bg-white/50 p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base text-indigo">{f.name}</h3>
              <span className="chip chip-active">{f.month}</span>
            </div>
            <p className="mt-2 text-sm text-ink/70">{f.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
