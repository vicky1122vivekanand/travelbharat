import { Navigate, Link } from "react-router-dom";
import { UserCircle, Heart, Map, LogOut } from "lucide-react";
import { useUserAuth } from "../context/UserAuthContext";
import { useWishlist } from "../context/WishlistContext";
import { useTrip } from "../context/TripContext";

export default function Profile() {
  const { user, loading, logout } = useUserAuth();
  const { items } = useWishlist();
  const { totalPlaces } = useTrip();

  if (loading) return <div className="p-14 text-center text-ink/50">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="mx-auto max-w-3xl px-5 py-14">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo text-paper">
          <UserCircle className="h-9 w-9" />
        </div>
        <div>
          <h1 className="font-display text-2xl text-indigo">{user.name}</h1>
          <p className="text-sm text-ink/60">{user.email} · {user.role}</p>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link to="/wishlist" className="flex items-center justify-between rounded-sm border border-ink/10 bg-white/50 p-5 hover:border-maroon/40">
          <div className="flex items-center gap-3">
            <Heart className="h-5 w-5 text-maroon" />
            <span className="font-semibold text-ink/80">Wishlist</span>
          </div>
          <span className="font-display text-xl text-maroon">{items.length}</span>
        </Link>
        <Link to="/trip-planner" className="flex items-center justify-between rounded-sm border border-ink/10 bg-white/50 p-5 hover:border-peacock/40">
          <div className="flex items-center gap-3">
            <Map className="h-5 w-5 text-peacock" />
            <span className="font-semibold text-ink/80">Trip Planner</span>
          </div>
          <span className="font-display text-xl text-peacock">{totalPlaces}</span>
        </Link>
      </div>

      <p className="mt-6 text-xs text-ink/40">
        Your wishlist and trip plan are saved to your account and sync across devices when you're logged in.
      </p>

      <button onClick={logout} className="btn-outline mt-10">
        <LogOut className="h-4 w-4" /> Log Out
      </button>
    </div>
  );
}
