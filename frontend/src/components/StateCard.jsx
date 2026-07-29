import { Link } from "react-router-dom";

export default function StateCard({ state }) {
  return (
    <Link
      to={`/states/${state.slug}`}
      className="group relative flex h-40 flex-col justify-end overflow-hidden rounded-sm border border-ink/10 bg-indigo p-4 text-paper transition-transform hover:-translate-y-1"
    >
      {state.coverImage && (
        <img
          src={state.coverImage}
          alt={state.name}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover opacity-40 transition-opacity group-hover:opacity-55"
        />
      )}
      <div className="relative">
        <p className="text-xs font-semibold uppercase tracking-widest text-marigold">{state.region}</p>
        <h3 className="font-display text-xl">{state.name}</h3>
      </div>
    </Link>
  );
}
