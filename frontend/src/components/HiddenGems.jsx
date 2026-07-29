import { useEffect, useState } from "react";
import { Gem } from "lucide-react";
import { PlacesAPI } from "../api/services";
import PlaceCard from "./PlaceCard";

export default function HiddenGems() {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    PlacesAPI.list({ hiddenGems: "true", limit: 3 }).then((d) => setPlaces(d.places));
  }, []);

  if (places.length === 0) return null;

  return (
    <section className="bg-peacock/5">
      <div className="mx-auto max-w-6xl px-5 py-16">
        <div className="mb-2 flex items-center gap-2">
          <Gem className="h-5 w-5 text-peacock" />
          <h2 className="font-display text-2xl text-indigo">Hidden Gems Worth Discovering</h2>
        </div>
        <p className="mb-6 max-w-xl text-sm text-ink/60">
          Lesser-known destinations that rarely make the usual travel lists — but deserve to.
        </p>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {places.map((p) => (
            <div key={p._id} className="relative">
              <PlaceCard place={p} />
              {p.hiddenGemNote && (
                <p className="mt-2 text-xs italic text-peacock">💎 {p.hiddenGemNote}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
