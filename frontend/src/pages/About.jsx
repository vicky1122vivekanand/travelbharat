import { Info, Compass, ShieldCheck } from "lucide-react";

const ASSUMPTIONS = [
  "Tourism information shown here is drawn from publicly available sources and is believed reliable, but is not a substitute for official government or on-ground verification.",
  "The platform assumes visitors have basic internet access to browse content, images and API-driven pages.",
  "All content is currently informational only — there is no booking, payment, or live-availability data anywhere on the site.",
];

const CONSTRAINTS = [
  "No real-time booking is available in this phase — external booking links (where shown) simply point to third-party providers.",
  "Destination content is manually curated and verified by admins; coverage naturally grows over time and isn't exhaustive on day one.",
  "Multilingual support is limited initially — the interface and content are in English, with Hindi/regional language support planned for a future phase.",
];

const DOMESTIC_TOURISM_FACTS = [
  "India has 43 UNESCO World Heritage Sites, but a large share of domestic travel still concentrates on a handful of famous destinations.",
  "Every state and union territory has verified, historically or naturally significant places — many rarely visited by travelers from other states.",
  "Domestic tourism supports local economies directly: homestays, regional cuisine, artisans and small transport operators all benefit more from in-country travel.",
];

export default function About() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-14">
      <h1 className="flex items-center gap-2 font-display text-3xl text-indigo">
        <Info className="h-7 w-7 text-peacock" /> About TravelBharat
      </h1>
      <p className="mt-2 max-w-2xl text-ink/60">
        A digital travel encyclopedia of India — built to make structured, verified tourism
        information easy to find in one place.
      </p>

      <div className="mt-10 rounded-sm border border-ink/10 bg-white/50 p-6">
        <h2 className="mb-3 flex items-center gap-2 font-display text-lg text-indigo">
          <Compass className="h-5 w-5 text-marigold-dark" /> Why Explore India?
        </h2>
        <ul className="list-disc space-y-2 pl-5 text-sm text-ink/70">
          {DOMESTIC_TOURISM_FACTS.map((f, i) => (
            <li key={i}>{f}</li>
          ))}
        </ul>
      </div>

      <div className="mt-8 rounded-sm border border-ink/10 bg-white/50 p-6">
        <h2 className="mb-3 flex items-center gap-2 font-display text-lg text-indigo">
          <ShieldCheck className="h-5 w-5 text-peacock" /> Assumptions
        </h2>
        <ul className="list-disc space-y-2 pl-5 text-sm text-ink/70">
          {ASSUMPTIONS.map((a, i) => (
            <li key={i}>{a}</li>
          ))}
        </ul>
      </div>

      <div className="mt-8 rounded-sm border border-ink/10 bg-white/50 p-6">
        <h2 className="mb-3 font-display text-lg text-indigo">Constraints (Current Phase)</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm text-ink/70">
          {CONSTRAINTS.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
      </div>

      <p className="mt-8 text-xs text-ink/40">
        Have a correction or addition? Content moderation is manual — admins review and verify
        every published destination.
      </p>
    </div>
  );
}
