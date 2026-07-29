import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(form.email, form.password);
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5 py-14">
      <h1 className="font-display text-2xl text-indigo">Admin Login</h1>
      <p className="mt-1 text-sm text-ink/60">Sign in to manage TravelBharat content.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink/60">Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-sm border border-ink/15 bg-white/60 px-3 py-2.5 text-sm focus:outline-none"
            placeholder="admin@travelbharat.in"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink/60">Password</label>
          <input
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full rounded-sm border border-ink/15 bg-white/60 px-3 py-2.5 text-sm focus:outline-none"
            placeholder="••••••••"
          />
        </div>

        {error && <p className="text-sm text-maroon">{error}</p>}

        <button type="submit" disabled={submitting} className="btn-primary w-full justify-center">
          {submitting ? "Signing in…" : "Sign In"}
        </button>
      </form>

      <p className="mt-6 text-xs text-ink/40">
        Seeded demo credentials: admin@travelbharat.in / Admin@123
      </p>
    </div>
  );
}
