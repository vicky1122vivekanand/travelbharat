import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";
import { PlacesAPI } from "../api/services";

export default function SpecialOffers() {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    PlacesAPI.list({ offers: "true", limit: 4 }).then((d) => setOffers(d.places));
  }, []);

  if (offers.length === 0) return null;

  return (
    <section className="bg-marigold/10">
      <div className="mx-auto max-w-6xl px-5 py-16">
        <div className="mb-6 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-marigold-dark" />
          <h2 className="font-display text-2xl text-indigo">Special Offers This Season</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {offers.map((p) => (
            <Link
              key={p._id}
              to={`/places/${p.slug}`}
              className="group flex items-center justify-between rounded-sm border border-marigold/40 bg-paper p-5 transition-shadow hover:shadow-md"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-marigold-dark">
                  {p.city?.name}, {p.state?.name}
                </p>
                <h3 className="mt-1 font-display text-lg text-indigo">{p.name}</h3>
                <p className="mt-1 text-sm text-ink/60">{p.offerText}</p>
              </div>
              <ArrowRight className="h-5 w-5 flex-shrink-0 text-marigold-dark transition-transform group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
