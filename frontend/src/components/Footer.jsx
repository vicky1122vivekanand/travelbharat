import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-ink/10 bg-indigo text-paper/80">
      <div className="booti-divider" />
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-4">
        <div>
          <h3 className="font-display text-lg text-paper">TravelBharat</h3>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-paper/60">
            A digital travel encyclopedia of India — heritage, nature, faith and adventure,
            organized state by state.
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-marigold">Explore</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/states" className="hover:text-paper">Browse by State</Link></li>
            <li><Link to="/explore" className="hover:text-paper">All Destinations</Link></li>
            <li><Link to="/explore?category=heritage" className="hover:text-paper">Heritage Sites</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-marigold">Plan Your Trip</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/toolkit" className="hover:text-paper">Travel Toolkit</Link></li>
            <li><Link to="/trip-planner" className="hover:text-paper">Trip Planner</Link></li>
            <li><Link to="/wishlist" className="hover:text-paper">Wishlist</Link></li>
            <li><Link to="/emergency" className="hover:text-paper">Emergency Contacts</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-marigold">Platform</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/for-students" className="hover:text-paper">For Students &amp; Researchers</Link></li>
            <li><Link to="/about" className="hover:text-paper">About &amp; Assumptions</Link></li>
            <li><Link to="/admin/login" className="hover:text-paper">Admin Panel</Link></li>
            <li className="text-paper/50">Bookings &amp; reviews — coming soon</li>
          </ul>
        </div>
      </div>
      <p className="border-t border-paper/10 py-5 text-center text-xs text-paper/50">
        © {new Date().getFullYear()} TravelBharat. Informational platform — no bookings or payments.
      </p>
    </footer>
  );
}
