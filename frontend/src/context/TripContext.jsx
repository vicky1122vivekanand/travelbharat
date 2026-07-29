import { createContext, useContext, useEffect, useState } from "react";
import { UsersAPI } from "../api/userServices";
import { useUserAuth } from "./UserAuthContext";

const TripContext = createContext(null);
const STORAGE_KEY = "tb_trip_plan";
const DEFAULT_DAYS = [{ id: "day-1", label: "Day 1", places: [] }];

// Backend days don't carry a client-side `id`; add one for React keys/local ops.
const withIds = (days) =>
  (days || []).map((d, i) => ({ id: d.id || d._id || `day-${i + 1}-${Date.now()}`, label: d.label, places: d.places || [] }));

export function TripProvider({ children }) {
  const { user } = useUserAuth();
  const [days, setDays] = useState(DEFAULT_DAYS);

  useEffect(() => {
    if (user) {
      UsersAPI.getTripPlan()
        .then(async (backendDays) => {
          const hasBackendPlaces = backendDays.some((d) => d.places?.length > 0);
          if (!hasBackendPlaces) {
            try {
              const local = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
              if (local && local.some((d) => d.places?.length > 0)) {
                await UsersAPI.setTripPlan(local.map((d) => ({ label: d.label, places: d.places.map((p) => p._id) })));
                setDays(withIds(local));
                return;
              }
            } catch {
              /* ignore malformed local storage */
            }
          }
          setDays(withIds(backendDays.length ? backendDays : DEFAULT_DAYS));
        })
        .catch(() => setDays(DEFAULT_DAYS));
    } else {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        setDays(stored ? withIds(JSON.parse(stored)) : DEFAULT_DAYS);
      } catch {
        setDays(DEFAULT_DAYS);
      }
    }
  }, [user]);

  const persist = (next) => {
    setDays(next);
    if (user) {
      UsersAPI.setTripPlan(next.map((d) => ({ label: d.label, places: d.places.map((p) => p._id) }))).catch(() => {});
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    }
  };

  const addDay = () => {
    const next = [...days, { id: `day-${days.length + 1}-${Date.now()}`, label: `Day ${days.length + 1}`, places: [] }];
    persist(next);
  };

  const removeDay = (dayId) => {
    if (days.length === 1) return;
    persist(days.filter((d) => d.id !== dayId));
  };

  const addPlaceToDay = (dayId, place) => {
    const next = days.map((d) =>
      d.id === dayId && !d.places.some((p) => p._id === place._id)
        ? { ...d, places: [...d.places, place] }
        : d
    );
    persist(next);
  };

  const removePlaceFromDay = (dayId, placeId) => {
    const next = days.map((d) =>
      d.id === dayId ? { ...d, places: d.places.filter((p) => p._id !== placeId) } : d
    );
    persist(next);
  };

  const clearTrip = () => persist(DEFAULT_DAYS);

  const totalPlaces = days.reduce((sum, d) => sum + d.places.length, 0);

  return (
    <TripContext.Provider
      value={{ days, addDay, removeDay, addPlaceToDay, removePlaceFromDay, clearTrip, totalPlaces }}
    >
      {children}
    </TripContext.Provider>
  );
}

export const useTrip = () => useContext(TripContext);
