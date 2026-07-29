import { useEffect, useState } from "react";
import { Sun, Snowflake, CloudRain } from "lucide-react";
import { PlacesAPI } from "../api/services";
import PlaceCard from "./PlaceCard";

const currentSeason = () => {
  const month = new Date().getMonth() + 1; // 1-12
  if (month === 11 || month === 12 || month <= 2) return { key: "Winter", icon: Snowflake };
  if (month >= 3 && month <= 6) return { key: "Summer", icon: Sun };
  return { key: "Monsoon", icon: CloudRain };
};

export default function SeasonalRecommendations() {
  const [places, setPlaces] = useState([]);
  const season = currentSeason();
  const Icon = season.icon;

  useEffect(() => {
    PlacesAPI.list({ season: season.key, limit: 3 }).then((d) => setPlaces(d.places));
  }, []);

  if (places.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-5 pb-20">
      <div className="mb-6 flex items-center gap-2">
        <Icon className="h-5 w-5 text-peacock" />
        <h2 className="font-display text-2xl text-indigo">Best for {season.key} Right Now</h2>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {places.map((p) => (
          <PlaceCard key={p._id} place={p} />
        ))}
      </div>
    </section>
  );
}
