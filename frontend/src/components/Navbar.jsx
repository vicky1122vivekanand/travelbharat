import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, MapPinned, Heart, Map, ShieldAlert, UserCircle } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { useTrip } from "../context/TripContext";
import { useUserAuth } from "../context/UserAuthContext";

const links = [
  { to: "/", label: "Home" },
  { to: "/states", label: "States" },
  { to: "/explore", label: "Explore" },
  { to: "/toolkit", label: "Toolkit" },
  { to: "/for-students", label: "For Students" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { items } = useWishlist();
  const { totalPlaces } = useTrip();
  const { user } = useUserAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link to="/" className="flex items-center gap-2 font-display text-xl text-indigo">
          <MapPinned className="h-6 w-6 text-maroon" strokeWidth={2} />
          TravelBharat
        </Link>

        <nav className="hidden items-center gap-5 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `font-body text-sm font-semibold uppercase tracking-wide transition-colors ${
                  isActive ? "text-maroon" : "text-ink/70 hover:text-ink"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}

          <div className="flex items-center gap-3 border-l border-ink/10 pl-4">
            <Link to="/emergency" title="Emergency Contacts" className="text-ink/60 hover:text-maroon">
              <ShieldAlert className="h-5 w-5" />
            </Link>
            <Link to="/trip-planner" title="Trip Planner" className="relative text-ink/60 hover:text-peacock">
              <Map className="h-5 w-5" />
              {totalPlaces > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-peacock text-[10px] text-paper">
                  {totalPlaces}
                </span>
              )}
            </Link>
            <Link to="/wishlist" title="Wishlist" className="relative text-ink/60 hover:text-maroon">
              <Heart className="h-5 w-5" />
              {items.length > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-maroon text-[10px] text-paper">
                  {items.length}
                </span>
              )}
            </Link>
          </div>

          {user ? (
            <Link to="/profile" title="My Profile" className="flex items-center gap-1 text-ink/70 hover:text-indigo">
              <UserCircle className="h-6 w-6" />
              <span className="text-sm font-semibold">{user.name.split(" ")[0]}</span>
            </Link>
          ) : (
            <Link to="/login" className="btn-outline !py-1.5 !px-4 text-sm">
              Log In
            </Link>
          )}
          <Link to="/admin/login" className="text-xs font-semibold uppercase tracking-wide text-ink/30 hover:text-ink/60">
            Admin
          </Link>
        </nav>

        <button className="md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-ink/10 bg-paper px-5 py-4 md:hidden">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="py-2 font-body text-sm font-semibold uppercase tracking-wide text-ink/80"
            >
              {l.label}
            </NavLink>
          ))}
          <Link to="/wishlist" onClick={() => setOpen(false)} className="py-2 font-body text-sm font-semibold uppercase tracking-wide text-ink/80">
            Wishlist {items.length > 0 && `(${items.length})`}
          </Link>
          <Link to="/trip-planner" onClick={() => setOpen(false)} className="py-2 font-body text-sm font-semibold uppercase tracking-wide text-ink/80">
            Trip Planner {totalPlaces > 0 && `(${totalPlaces})`}
          </Link>
          <Link to="/emergency" onClick={() => setOpen(false)} className="py-2 font-body text-sm font-semibold uppercase tracking-wide text-ink/80">
            Emergency Contacts
          </Link>
          <Link to="/about" onClick={() => setOpen(false)} className="py-2 font-body text-sm font-semibold uppercase tracking-wide text-ink/80">
            About
          </Link>
          {user ? (
            <Link to="/profile" onClick={() => setOpen(false)} className="py-2 font-body text-sm font-semibold uppercase tracking-wide text-maroon">
              My Profile
            </Link>
          ) : (
            <Link to="/login" onClick={() => setOpen(false)} className="py-2 font-body text-sm font-semibold uppercase tracking-wide text-maroon">
              Log In / Sign Up
            </Link>
          )}
          <Link to="/admin/login" onClick={() => setOpen(false)} className="py-2 font-body text-xs font-semibold uppercase tracking-wide text-ink/40">
            Admin
          </Link>
        </nav>
      )}

      <div className="booti-divider" />
    </header>
  );
}
