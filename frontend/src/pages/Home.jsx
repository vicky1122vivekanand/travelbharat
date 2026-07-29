import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Compass } from "lucide-react";
import { StatesAPI, PlacesAPI } from "../api/services";
import StateCard from "../components/StateCard";
import PlaceCard from "../components/PlaceCard";
import SeasonalRecommendations from "../components/SeasonalRecommendations";
import SpecialOffers from "../components/SpecialOffers";
import HiddenGems from "../components/HiddenGems";
import DomesticTourismBanner from "../components/DomesticTourismBanner";
import useDocumentTitle from "../hooks/useDocumentTitle";

export default function Home() {
  useDocumentTitle(null, "Explore India state by state — heritage, nature, wildlife, beaches and more, all in one structured travel encyclopedia.");
  const [states, setStates] = useState([]);
  const [places, setPlaces] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    StatesAPI.list().then((data) => setStates(data.slice(0, 6)));
    PlacesAPI.list({ limit: 6 }).then((data) => setPlaces(data.places));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    window.location.href = `/explore?q=${encodeURIComponent(query)}`;
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-indigo text-paper">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-20 md:grid-cols-2 md:py-28">
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-marigold">
              28 states · 8 union territories · one platform
            </p>
            <h1 className="font-display text-4xl leading-tight md:text-5xl">
              Explore India, state by state.
            </h1>
            <p className="mt-5 max-w-md text-paper/70">
              TravelBharat is a digital travel encyclopedia — structured, verified destination
              details for every corner of the country, from Himalayan passes to backwater
              villages.
            </p>

            <form onSubmit={handleSearch} className="mt-8 flex max-w-md overflow-hidden rounded-sm border border-paper/20">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search a place, state or category…"
                className="flex-1 bg-paper/10 px-4 py-3 text-sm text-paper placeholder:text-paper/50 focus:outline-none"
              />
              <button type="submit" className="flex items-center gap-2 bg-marigold px-4 font-semibold text-indigo-dark hover:bg-marigold-dark">
                <Search className="h-4 w-4" /> Search
              </button>
            </form>

            <div className="mt-8 flex gap-4 text-sm">
              <Link to="/states" className="btn-primary">
                Browse states
              </Link>
              <Link to="/explore" className="inline-flex items-center gap-2 font-semibold text-paper/80 hover:text-paper">
                <Compass className="h-4 w-4" /> Explore all destinations
              </Link>
            </div>
          </div>

          <div className="relative hidden md:block">
            <div className="booti-divider rotate-90 absolute -left-2 top-0 h-full w-4" />
            <img
              src="https://commons.wikimedia.org/wiki/Special:FilePath/City_Palace_by_lake_Pichola,_Udaipur.jpg?width=800"
              alt="City Palace Udaipur"
              className="h-80 w-full rounded-sm object-cover shadow-2xl"
            />
          </div>
        </div>
        <div className="booti-divider" />
      </section>

      <DomesticTourismBanner />

      <SpecialOffers />

      {/* Featured states */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-2xl text-indigo">Featured States</h2>
          <Link to="/states" className="text-sm font-semibold text-maroon hover:underline">
            View all states →
          </Link>
        </div>
        {states.length === 0 ? (
          <p className="text-sm text-ink/50">No states yet — seed the database to see content here.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {states.map((s) => (
              <StateCard key={s._id} state={s} />
            ))}
          </div>
        )}
      </section>

      <SeasonalRecommendations />

      <HiddenGems />

      {/* Recently added places */}
      <section className="mx-auto max-w-6xl px-5 pb-20">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-2xl text-indigo">Recently Added Destinations</h2>
          <Link to="/explore" className="text-sm font-semibold text-maroon hover:underline">
            Explore all →
          </Link>
        </div>
        {places.length === 0 ? (
          <p className="text-sm text-ink/50">No destinations yet — run the seed script.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {places.map((p) => (
              <PlaceCard key={p._id} place={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
