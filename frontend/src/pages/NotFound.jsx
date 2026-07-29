import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col items-center px-5 py-32 text-center">
      <h1 className="font-display text-5xl text-indigo">404</h1>
      <p className="mt-4 text-ink/60">This destination could not be found on the map.</p>
      <Link to="/" className="btn-primary mt-8">Back to Home</Link>
    </div>
  );
}
