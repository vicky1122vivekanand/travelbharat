import { Link } from "react-router-dom";
import { Flag } from "lucide-react";

export default function DomesticTourismBanner() {
  return (
    <section className="border-y border-ink/10 bg-indigo/5">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-3 px-5 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <Flag className="mt-1 h-5 w-5 flex-shrink-0 text-maroon" />
          <p className="text-sm text-ink/70">
            <span className="font-semibold text-ink">Every state has a story worth visiting.</span>{" "}
            Domestic travel supports local homestays, artisans and regional cuisine directly —
            explore beyond the usual circuit.
          </p>
        </div>
        <Link to="/about" className="whitespace-nowrap text-sm font-semibold text-maroon hover:underline">
          Why explore India? →
        </Link>
      </div>
    </section>
  );
}
