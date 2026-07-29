import { Link } from "react-router-dom";
import { Map, Plus, Trash2, X } from "lucide-react";
import { useTrip } from "../context/TripContext";

export default function TripPlanner() {
  const { days, addDay, removeDay, removePlaceFromDay, clearTrip, totalPlaces } = useTrip();

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 font-display text-3xl text-indigo">
            <Map className="h-7 w-7 text-peacock" /> Trip Planner
          </h1>
          <p className="mt-2 text-ink/60">
            Build a day-wise itinerary — saved locally on this device. {totalPlaces} stop{totalPlaces !== 1 ? "s" : ""} planned so far.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={addDay} className="btn-outline">
            <Plus className="h-4 w-4" /> Add Day
          </button>
          {totalPlaces > 0 && (
            <button onClick={clearTrip} className="text-sm font-semibold text-maroon hover:underline">
              Clear trip
            </button>
          )}
        </div>
      </div>

      <p className="mt-6 text-sm text-ink/50">
        Tip: open any destination page and use "Add to Trip" to slot it into a day below.
      </p>

      <div className="mt-8 space-y-6">
        {days.map((day) => (
          <div key={day.id} className="rounded-sm border border-ink/10 bg-white/50 p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg text-indigo">{day.label}</h2>
              {days.length > 1 && (
                <button onClick={() => removeDay(day.id)} className="text-ink/40 hover:text-maroon">
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>

            {day.places.length === 0 ? (
              <p className="text-sm text-ink/40">No stops added yet for this day.</p>
            ) : (
              <ul className="space-y-2">
                {day.places.map((p) => (
                  <li key={p._id} className="flex items-center justify-between rounded-sm bg-ink/5 px-4 py-3">
                    <Link to={`/places/${p.slug}`} className="text-sm font-semibold text-ink/90 hover:text-maroon">
                      {p.name}
                    </Link>
                    <div className="flex items-center gap-3 text-xs text-ink/50">
                      <span>{p.city?.name}, {p.state?.name}</span>
                      <button onClick={() => removePlaceFromDay(day.id, p._id)} className="text-ink/40 hover:text-maroon">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
