import { Link } from "react-router-dom";
import { MapPin, CalendarDays, Heart } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";

export default function PlaceCard({ place }) {
  const cover = place.images?.find((i) => i.isCover) || place.images?.[0];
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(place._id);

  return (
    <Link
      to={`/places/${place.slug}`}
      className="group flex flex-col overflow-hidden rounded-sm border border-ink/10 bg-white/40 transition-shadow hover:shadow-lg"
    >
      <div className="relative h-48 overflow-hidden bg-ink/10">
        {cover && (
          <img
            src={cover.url}
            alt={place.name}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1">
          {place.categories?.slice(0, 2).map((c) => (
            <span key={c._id} className="chip bg-paper/90">
              {c.name}
            </span>
          ))}
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(place);
          }}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-paper/90 transition-colors hover:bg-paper"
        >
          <Heart className={`h-4 w-4 ${wishlisted ? "fill-maroon text-maroon" : "text-ink/50"}`} />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-display text-lg leading-snug text-indigo">{place.name}</h3>
        <p className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-ink/50">
          <MapPin className="h-3.5 w-3.5" />
          {place.city?.name}, {place.state?.name}
        </p>
        <p className="line-clamp-2 text-sm text-ink/70">{place.shortDescription}</p>
        {place.bestTimeToVisit && (
          <p className="mt-auto flex items-center gap-1 pt-2 text-xs font-semibold text-peacock">
            <CalendarDays className="h-3.5 w-3.5" />
            Best time: {place.bestTimeToVisit}
          </p>
        )}
      </div>
    </Link>
  );
}
