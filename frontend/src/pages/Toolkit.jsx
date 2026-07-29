import PackingChecklist from "../components/PackingChecklist";
import CurrencyDistanceConverter from "../components/CurrencyDistanceConverter";

export default function Toolkit() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <h1 className="font-display text-3xl text-indigo">Travel Toolkit</h1>
      <p className="mt-2 max-w-xl text-ink/60">
        Handy tools for planning your trip — generate a packing list and convert currency or
        distance on the fly.
      </p>

      <div className="mt-10 space-y-10">
        <PackingChecklist />
        <CurrencyDistanceConverter />
      </div>
    </div>
  );
}
