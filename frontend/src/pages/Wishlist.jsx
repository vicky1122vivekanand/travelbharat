import { Link } from "react-router-dom";
import { Heart, Trash2 } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import PlaceCard from "../components/PlaceCard";

export default function Wishlist() {
  const { items, removeFromWishlist } = useWishlist();

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <h1 className="flex items-center gap-2 font-display text-3xl text-indigo">
        <Heart className="h-7 w-7 text-maroon" /> Your Wishlist
      </h1>
      <p className="mt-2 text-ink/60">
        Saved locally on this device — {items.length} destination{items.length !== 1 ? "s" : ""} saved.
      </p>

      {items.length === 0 ? (
        <div className="mt-12 rounded-sm border border-dashed border-ink/20 p-14 text-center">
          <p className="text-ink/50">No destinations saved yet.</p>
          <Link to="/explore" className="btn-primary mt-6 inline-flex">Explore destinations</Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((place) => (
            <div key={place._id} className="relative">
              <PlaceCard place={place} />
              <button
                onClick={() => removeFromWishlist(place._id)}
                className="absolute bottom-3 right-3 flex items-center gap-1 rounded-sm bg-ink/80 px-2 py-1 text-xs text-paper hover:bg-maroon"
              >
                <Trash2 className="h-3 w-3" /> Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
