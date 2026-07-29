import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { PlacesAPI, CategoriesAPI, StatesAPI } from "../api/services";
import PlaceCard from "../components/PlaceCard";
import CategoryFilter from "../components/CategoryFilter";
import useDocumentTitle from "../hooks/useDocumentTitle";

export default function Explore() {
  useDocumentTitle("Explore Destinations", "Search and filter tourist destinations across India by state, category, budget and more.");
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [states, setStates] = useState([]);
  const [result, setResult] = useState({ places: [], page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  const q = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const state = searchParams.get("state") || "";
  const budget = searchParams.get("budget") || "";
  const suitableFor = searchParams.get("suitableFor") || "";
  const duration = searchParams.get("duration") || "";
  const page = Number(searchParams.get("page") || 1);

  useEffect(() => {
    CategoriesAPI.list().then(setCategories);
    StatesAPI.list().then(setStates);
  }, []);

  useEffect(() => {
    setLoading(true);
    PlacesAPI.list({
      q: q || undefined,
      category: category || undefined,
      state: state || undefined,
      budget: budget || undefined,
      suitableFor: suitableFor || undefined,
      duration: duration || undefined,
      page,
    })
      .then(setResult)
      .finally(() => setLoading(false));
  }, [q, category, state, budget, suitableFor, duration, page]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete("page");
    setSearchParams(next);
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <h1 className="font-display text-3xl text-indigo">Explore Destinations</h1>
      <p className="mt-2 text-ink/60">{result.total} destinations found across India.</p>

      <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex max-w-md flex-1 items-center gap-2 rounded-sm border border-ink/15 bg-white/50 px-3">
          <Search className="h-4 w-4 text-ink/40" />
          <input
            defaultValue={q}
            onKeyDown={(e) => e.key === "Enter" && updateParam("q", e.target.value)}
            onBlur={(e) => updateParam("q", e.target.value)}
            placeholder="Search destinations…"
            className="w-full bg-transparent py-2.5 text-sm focus:outline-none"
          />
        </div>

        <select
          value={state}
          onChange={(e) => updateParam("state", e.target.value)}
          className="rounded-sm border border-ink/15 bg-white/50 px-3 py-2.5 text-sm"
        >
          <option value="">All States</option>
          {states.map((s) => (
            <option key={s._id} value={s.slug}>{s.name}</option>
          ))}
        </select>

        <select
          value={budget}
          onChange={(e) => updateParam("budget", e.target.value)}
          className="rounded-sm border border-ink/15 bg-white/50 px-3 py-2.5 text-sm"
        >
          <option value="">Any Budget</option>
          <option value="Budget">Budget</option>
          <option value="Mid-range">Mid-range</option>
          <option value="Luxury">Luxury</option>
        </select>

        <select
          value={suitableFor}
          onChange={(e) => updateParam("suitableFor", e.target.value)}
          className="rounded-sm border border-ink/15 bg-white/50 px-3 py-2.5 text-sm"
        >
          <option value="">Family / Couple / Solo / Group</option>
          <option value="Family">Family</option>
          <option value="Couple">Couple</option>
          <option value="Solo">Solo</option>
          <option value="Group">Group</option>
        </select>

        <select
          value={duration}
          onChange={(e) => updateParam("duration", e.target.value)}
          className="rounded-sm border border-ink/15 bg-white/50 px-3 py-2.5 text-sm"
        >
          <option value="">Any Duration</option>
          <option value="Half day">Half day</option>
          <option value="1 day">1 day</option>
          <option value="2">2+ days</option>
        </select>
      </div>

      <div className="mt-4">
        <CategoryFilter categories={categories} active={category} onChange={(v) => updateParam("category", v)} />
      </div>

      {loading ? (
        <p className="mt-10 text-sm text-ink/50">Loading destinations…</p>
      ) : result.places.length === 0 ? (
        <p className="mt-10 text-sm text-ink/50">No destinations match your search.</p>
      ) : (
        <>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {result.places.map((p) => (
              <PlaceCard key={p._id} place={p} />
            ))}
          </div>

          {result.pages > 1 && (
            <div className="mt-10 flex justify-center gap-2">
              {Array.from({ length: result.pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => updateParam("page", String(p))}
                  className={`h-9 w-9 rounded-sm text-sm font-semibold ${
                    p === page ? "bg-maroon text-paper" : "border border-ink/15 text-ink/70"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
