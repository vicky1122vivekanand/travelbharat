import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, LogOut } from "lucide-react";
import { PlacesAPI } from "../../api/services";
import { useAuth } from "../../context/AuthContext";

export default function AdminDashboard() {
  const { admin, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [places, setPlaces] = useState([]);

  const loadPlaces = () => PlacesAPI.list({ limit: 50 }).then((d) => setPlaces(d.places));

  useEffect(() => {
    PlacesAPI.stats().then(setStats);
    loadPlaces();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this tourist place? This cannot be undone.")) return;
    await PlacesAPI.remove(id);
    loadPlaces();
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-indigo">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-ink/60">Signed in as {admin?.name} ({admin?.role})</p>
        </div>
        <button onClick={logout} className="btn-outline">
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>

      {stats && (
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-5">
          {[
            ["Total Places", stats.totalPlaces],
            ["States", stats.totalStates],
            ["Cities", stats.totalCities],
            ["Categories", stats.totalCategories],
            ["Unverified", stats.unverified],
          ].map(([label, value]) => (
            <div key={label} className="rounded-sm border border-ink/10 bg-white/50 p-4 text-center">
              <p className="font-mono text-2xl text-maroon">{value}</p>
              <p className="mt-1 text-xs uppercase tracking-wide text-ink/50">{label}</p>
            </div>
          ))}
        </div>
      )}

      {stats && (
        <div className="mt-4">
          <h2 className="mb-3 font-display text-lg text-indigo">Key Performance Indicators</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            <div className="rounded-sm border border-ink/10 bg-peacock/5 p-4 text-center">
              <p className="font-mono text-2xl text-peacock">{stats.contentAccuracyRate}%</p>
              <p className="mt-1 text-xs uppercase tracking-wide text-ink/50">Content Accuracy Rate</p>
              <p className="mt-1 text-[10px] text-ink/40">Target: ≥ 95% (verified / total places)</p>
            </div>
            <div className="rounded-sm border border-ink/10 bg-marigold/10 p-4 text-center">
              <p className="font-mono text-2xl text-marigold-dark">{stats.totalViews}</p>
              <p className="mt-1 text-xs uppercase tracking-wide text-ink/50">Total Destination Views</p>
              <p className="mt-1 text-[10px] text-ink/40">Engagement proxy (page views per place)</p>
            </div>
            <div className="rounded-sm border border-ink/10 bg-maroon/5 p-4 text-center">
              <p className="font-mono text-2xl text-maroon">{stats.newPlacesLast30Days}</p>
              <p className="mt-1 text-xs uppercase tracking-wide text-ink/50">New Places (30 Days)</p>
              <p className="mt-1 text-[10px] text-ink/40">Content growth rate</p>
            </div>
          </div>
          <p className="mt-3 text-xs text-ink/40">
            Monthly active users and bounce rate require a web analytics integration (e.g. Google
            Analytics / Plausible) — not tracked in-app. The metrics above are computed directly
            from platform data.
          </p>
        </div>
      )}

      <div className="mt-10 flex items-center justify-between">
        <h2 className="font-display text-xl text-indigo">Tourist Places</h2>
        <Link to="/admin/places/new" className="btn-primary">
          <Plus className="h-4 w-4" /> Add Place
        </Link>
      </div>

      <div className="mt-4 overflow-x-auto rounded-sm border border-ink/10 bg-white/50">
        <table className="w-full text-left text-sm">
          <thead className="bg-ink/5 text-xs uppercase tracking-wide text-ink/50">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">State</th>
              <th className="px-4 py-3">City</th>
              <th className="px-4 py-3">Verified</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {places.map((p) => (
              <tr key={p._id} className="border-t border-ink/10">
                <td className="px-4 py-3 font-medium text-ink">{p.name}</td>
                <td className="px-4 py-3 text-ink/60">{p.state?.name}</td>
                <td className="px-4 py-3 text-ink/60">{p.city?.name}</td>
                <td className="px-4 py-3">
                  <span className={`chip ${p.isVerified ? "chip-active" : ""}`}>
                    {p.isVerified ? "Verified" : "Pending"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-3">
                    <Link to={`/admin/places/${p._id}/edit`} className="text-peacock hover:text-peacock-dark">
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button onClick={() => handleDelete(p._id)} className="text-maroon hover:text-maroon-dark">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {places.length === 0 && <p className="p-6 text-center text-sm text-ink/50">No places yet.</p>}
      </div>
    </div>
  );
}
