import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { useUserAuth } from "../context/UserAuthContext";

export default function Signup() {
  const { register } = useUserAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "traveler" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await register(form.name, form.email, form.password, form.role);
      navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5 py-14">
      <h1 className="flex items-center gap-2 font-display text-2xl text-indigo">
        <UserPlus className="h-6 w-6 text-maroon" /> Create an Account
      </h1>
      <p className="mt-1 text-sm text-ink/60">
        Save your wishlist and trip plans across devices — free, no payment info needed.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink/60">Name</label>
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink/60">Email</label>
          <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink/60">Password</label>
          <input type="password" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input" placeholder="At least 6 characters" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink/60">I am a…</label>
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="input">
            <option value="traveler">Traveler</option>
            <option value="student">Student (tourism project)</option>
            <option value="researcher">Researcher</option>
          </select>
        </div>

        {error && <p className="text-sm text-maroon">{error}</p>}

        <button type="submit" disabled={submitting} className="btn-primary w-full justify-center">
          {submitting ? "Creating account…" : "Sign Up"}
        </button>
      </form>

      <p className="mt-6 text-sm text-ink/60">
        Already have an account? <Link to="/login" className="font-semibold text-maroon hover:underline">Log in</Link>
      </p>
    </div>
  );
}
