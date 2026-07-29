import { useEffect, useState } from "react";
import { ArrowLeftRight, Coins, Ruler } from "lucide-react";

const CURRENCIES = ["USD", "EUR", "GBP", "AED", "JPY", "AUD", "SGD"];

export default function CurrencyDistanceConverter() {
  // Currency state
  const [amount, setAmount] = useState(1000);
  const [to, setTo] = useState("USD");
  const [rate, setRate] = useState(null);
  const [rateError, setRateError] = useState(false);

  // Distance state
  const [km, setKm] = useState(10);

  useEffect(() => {
    setRate(null);
    setRateError(false);
    fetch(`https://api.frankfurter.app/latest?from=INR&to=${to}`)
      .then((r) => r.json())
      .then((data) => setRate(data.rates?.[to]))
      .catch(() => setRateError(true));
  }, [to]);

  const converted = rate ? (amount * rate).toFixed(2) : null;
  const miles = (km * 0.621371).toFixed(2);

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* Currency converter */}
      <div className="rounded-sm border border-ink/10 bg-white/50 p-6">
        <h2 className="mb-1 flex items-center gap-2 font-display text-xl text-indigo">
          <Coins className="h-5 w-5 text-marigold" /> Currency Converter
        </h2>
        <p className="mb-5 text-sm text-ink/60">Convert Indian Rupees to a foreign currency using live rates.</p>

        <div className="flex items-center gap-3">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="input w-32"
          />
          <span className="text-sm font-semibold text-ink/60">INR →</span>
          <select value={to} onChange={(e) => setTo(e.target.value)} className="input w-24">
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="mt-5 rounded-sm bg-peacock/10 p-4 text-center">
          {rateError && <p className="text-sm text-maroon">Live rate unavailable right now.</p>}
          {!rateError && !rate && <p className="text-sm text-ink/50">Fetching live rate…</p>}
          {converted && (
            <p className="font-display text-2xl text-indigo">
              {amount} INR ≈ {converted} {to}
            </p>
          )}
        </div>
        <p className="mt-2 text-[10px] uppercase tracking-wide text-ink/30">Live rate via Frankfurter (ECB reference rates)</p>
      </div>

      {/* Distance converter */}
      <div className="rounded-sm border border-ink/10 bg-white/50 p-6">
        <h2 className="mb-1 flex items-center gap-2 font-display text-xl text-indigo">
          <Ruler className="h-5 w-5 text-peacock" /> Distance Converter
        </h2>
        <p className="mb-5 text-sm text-ink/60">Quickly convert between kilometres and miles.</p>

        <div className="flex items-center gap-3">
          <input type="number" value={km} onChange={(e) => setKm(Number(e.target.value))} className="input w-32" />
          <span className="text-sm font-semibold text-ink/60">km</span>
          <ArrowLeftRight className="h-4 w-4 text-ink/40" />
          <span className="font-display text-lg text-indigo">{miles} mi</span>
        </div>
      </div>
    </div>
  );
}
