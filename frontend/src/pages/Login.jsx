import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import { useUserAuth } from "../context/UserAuthContext";

export default function Login() {
  const { login } = useUserAuth();
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
      navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5 py-14">
      <h1 className="flex items-center gap-2 font-display text-2xl text-indigo">
        <LogIn className="h-6 w-6 text-maroon" /> Log In
      </h1>
      <p className="mt-1 text-sm text-ink/60">Welcome back — access your wishlist and trip plans.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink/60">Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="input"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink/60">Password</label>
          <input
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="input"
          />
        </div>

        {error && <p className="text-sm text-maroon">{error}</p>}

        <button type="submit" disabled={submitting} className="btn-primary w-full justify-center">
          {submitting ? "Logging in…" : "Log In"}
        </button>
      </form>

      <p className="mt-6 text-sm text-ink/60">
        New here? <Link to="/signup" className="font-semibold text-maroon hover:underline">Create an account</Link>
      </p>
      <p className="mt-2 text-xs text-ink/40">
        Looking for the admin panel? <Link to="/admin/login" className="hover:text-maroon">Admin login</Link>
      </p>
    </div>
  );
}
