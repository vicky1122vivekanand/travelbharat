import { GraduationCap, Database, FileText, Lightbulb } from "lucide-react";

const PROJECT_IDEAS = [
  "Compare tourism infrastructure across 3 states using the category/budget filters as a dataset.",
  "Build a heatmap of festival months across India using the Festival API to study seasonal tourism patterns.",
  "Analyze which categories (Heritage/Nature/Wildlife/etc.) are most represented per region.",
  "Design a domestic-tourism awareness campaign using the Hidden Gems and Seasonal Recommendations data.",
  "Study budget-tier distribution (Budget/Mid-range/Luxury) across states to model accessible tourism.",
];

const API_ENDPOINTS = [
  { path: "GET /api/states", desc: "All states & union territories with region/capital." },
  { path: "GET /api/places?state=&category=&budget=", desc: "Filterable, paginated destination dataset." },
  { path: "GET /api/festivals?state=", desc: "State-wise festival/event calendar." },
  { path: "GET /api/places/:slug", desc: "Full structured record for a single destination." },
];

export default function ForStudents() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-14">
      <h1 className="flex items-center gap-2 font-display text-3xl text-indigo">
        <GraduationCap className="h-7 w-7 text-peacock" /> For Students &amp; Researchers
      </h1>
      <p className="mt-2 max-w-2xl text-ink/60">
        TravelBharat was built as a structured, verified dataset of Indian tourism — useful
        for tourism-management coursework, geography projects, and independent research, not
        just trip planning.
      </p>

      <div className="mt-10 rounded-sm border border-ink/10 bg-white/50 p-6">
        <h2 className="mb-3 flex items-center gap-2 font-display text-lg text-indigo">
          <Database className="h-5 w-5 text-peacock" /> Using the Data
        </h2>
        <p className="mb-4 text-sm text-ink/70">
          Every destination, state and festival is available as structured JSON through the
          public read endpoints below — no authentication required for read access.
        </p>
        <div className="space-y-2">
          {API_ENDPOINTS.map((e) => (
            <div key={e.path} className="flex flex-col gap-1 rounded-sm bg-ink/5 p-3 sm:flex-row sm:items-center sm:justify-between">
              <code className="font-mono text-xs text-maroon">{e.path}</code>
              <span className="text-xs text-ink/60">{e.desc}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 rounded-sm border border-ink/10 bg-white/50 p-6">
        <h2 className="mb-3 flex items-center gap-2 font-display text-lg text-indigo">
          <Lightbulb className="h-5 w-5 text-marigold-dark" /> Project Ideas
        </h2>
        <ul className="list-disc space-y-2 pl-5 text-sm text-ink/70">
          {PROJECT_IDEAS.map((idea, i) => (
            <li key={i}>{idea}</li>
          ))}
        </ul>
      </div>

      <div className="mt-8 rounded-sm border-l-4 border-marigold bg-marigold/10 p-5">
        <h2 className="mb-2 flex items-center gap-2 font-display text-base text-indigo">
          <FileText className="h-4 w-4 text-marigold-dark" /> Citing TravelBharat
        </h2>
        <p className="text-sm text-ink/70">
          If you use this platform's content in academic work, a simple citation is enough:
          "TravelBharat — Explore India State by State, accessed via traveIbharat.example ({new Date().getFullYear()})."
          Content is manually curated and periodically verified, but always cross-check
          critical facts (fees, timings) with an official source before publishing.
        </p>
      </div>
    </div>
  );
}
