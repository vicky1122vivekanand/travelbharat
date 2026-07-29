import { useEffect, useState } from "react";
import StateCard from "../components/StateCard";
import { StatesAPI } from "../api/services";
import useDocumentTitle from "../hooks/useDocumentTitle";

const REGIONS = ["North", "South", "East", "West", "Northeast", "Central"];

export default function StatesList() {
  useDocumentTitle("All States & Union Territories", "Browse all 28 states and 8 union territories of India.");
  const [states, setStates] = useState([]);
  const [region, setRegion] = useState("");

  useEffect(() => {
    StatesAPI.list(region ? { region } : {}).then(setStates);
  }, [region]);

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <h1 className="font-display text-3xl text-indigo">All States &amp; Union Territories</h1>
      <p className="mt-2 max-w-xl text-ink/60">
        Select a state to browse its cities, heritage sites, and natural wonders.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        <button onClick={() => setRegion("")} className={`chip ${region === "" ? "chip-active" : ""}`}>
          All Regions
        </button>
        {REGIONS.map((r) => (
          <button key={r} onClick={() => setRegion(r)} className={`chip ${region === r ? "chip-active" : ""}`}>
            {r}
          </button>
        ))}
      </div>

      {states.length === 0 ? (
        <p className="mt-10 text-sm text-ink/50">No states found. Seed the database to get started.</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {states.map((s) => (
            <StateCard key={s._id} state={s} />
          ))}
        </div>
      )}
    </div>
  );
}
