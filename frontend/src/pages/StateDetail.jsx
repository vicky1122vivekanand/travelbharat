import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { StatesAPI, CitiesAPI, PlacesAPI, CategoriesAPI, FestivalsAPI } from "../api/services";
import PlaceCard from "../components/PlaceCard";
import CategoryFilter from "../components/CategoryFilter";
import FestivalCalendar from "../components/FestivalCalendar";
import CuisineHighlights from "../components/CuisineHighlights";
import useDocumentTitle from "../hooks/useDocumentTitle";

export default function StateDetail() {
  const { slug } = useParams();
  const [state, setState] = useState(null);
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [places, setPlaces] = useState([]);
  const [festivals, setFestivals] = useState([]);
  useDocumentTitle(state?.name, state?.description);

  useEffect(() => {
    StatesAPI.getBySlug(slug).then(setState);
    CitiesAPI.list({ state: slug }).then(setCities);
    CategoriesAPI.list().then(setCategories);
    FestivalsAPI.list({ state: slug }).then(setFestivals);
  }, [slug]);

  useEffect(() => {
    PlacesAPI.list({ state: slug, category: category || undefined, limit: 24 }).then((d) => setPlaces(d.places));
  }, [slug, category]);

  if (!state) return <div className="p-14 text-center text-ink/50">Loading state…</div>;

  return (
    <div>
      <section className="bg-indigo text-paper">
        <div className="mx-auto max-w-6xl px-5 py-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-marigold">{state.region} India</p>
          <h1 className="mt-2 font-display text-4xl">{state.name}</h1>
          <p className="mt-4 max-w-2xl text-paper/70">{state.description}</p>
          <div className="mt-6 flex flex-wrap gap-6 text-sm text-paper/60">
            {state.capital && <span>Capital: <strong className="text-paper">{state.capital}</strong></span>}
            {state.placeCount !== undefined && <span>{state.placeCount} destinations listed</span>}
          </div>
        </div>
        <div className="booti-divider" />
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12">
        {cities.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-3 font-display text-xl text-indigo">Cities</h2>
            <div className="flex flex-wrap gap-2">
              {cities.map((c) => (
                <span key={c._id} className="chip">{c.name}</span>
              ))}
            </div>
          </div>
        )}

        <CuisineHighlights cuisine={state.cuisine} />
        <FestivalCalendar festivals={festivals} />

        <h2 className="mb-3 font-display text-xl text-indigo">Destinations in {state.name}</h2>
        <CategoryFilter categories={categories} active={category} onChange={setCategory} />

        {places.length === 0 ? (
          <p className="mt-10 text-sm text-ink/50">No destinations listed for this state yet.</p>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {places.map((p) => (
              <PlaceCard key={p._id} place={p} />
            ))}
          </div>
        )}

        <div className="mt-10">
          <Link to="/states" className="text-sm font-semibold text-maroon hover:underline">← Back to all states</Link>
        </div>
      </section>
    </div>
  );
}
