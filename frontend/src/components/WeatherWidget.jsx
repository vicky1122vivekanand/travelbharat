import { useEffect, useState } from "react";
import { Cloud, CloudRain, CloudSnow, Sun, CloudLightning, CloudFog, Wind } from "lucide-react";

// Open-Meteo WMO weather codes → simple label + icon
const WEATHER_CODES = {
  0: { label: "Clear sky", icon: Sun },
  1: { label: "Mostly clear", icon: Sun },
  2: { label: "Partly cloudy", icon: Cloud },
  3: { label: "Overcast", icon: Cloud },
  45: { label: "Fog", icon: CloudFog },
  48: { label: "Fog", icon: CloudFog },
  51: { label: "Light drizzle", icon: CloudRain },
  61: { label: "Light rain", icon: CloudRain },
  63: { label: "Rain", icon: CloudRain },
  65: { label: "Heavy rain", icon: CloudRain },
  71: { label: "Light snow", icon: CloudSnow },
  80: { label: "Rain showers", icon: CloudRain },
  95: { label: "Thunderstorm", icon: CloudLightning },
};

export default function WeatherWidget({ lat, lng, label }) {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (lat == null || lng == null) return;
    setWeather(null);
    setError(false);

    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&daily=temperature_2m_max,temperature_2m_min&timezone=auto`
    )
      .then((r) => r.json())
      .then((data) => setWeather(data))
      .catch(() => setError(true));
  }, [lat, lng]);

  if (lat == null || lng == null) return null;

  const code = weather?.current_weather?.weathercode;
  const info = WEATHER_CODES[code] || { label: "—", icon: Wind };
  const Icon = info.icon;

  return (
    <div className="rounded-sm border border-ink/10 bg-peacock/5 p-4">
      <h3 className="mb-3 flex items-center gap-2 font-display text-base text-indigo">
        <Icon className="h-4 w-4 text-peacock" /> Weather in {label}
      </h3>

      {error && <p className="text-xs text-ink/50">Weather data unavailable right now.</p>}

      {!error && !weather && <p className="text-xs text-ink/50">Fetching current conditions…</p>}

      {weather?.current_weather && (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-semibold text-ink">{Math.round(weather.current_weather.temperature)}°C</p>
            <p className="text-xs text-ink/60">{info.label}</p>
          </div>
          {weather.daily && (
            <div className="text-right text-xs text-ink/60">
              <p>High {Math.round(weather.daily.temperature_2m_max[0])}°C</p>
              <p>Low {Math.round(weather.daily.temperature_2m_min[0])}°C</p>
            </div>
          )}
        </div>
      )}
      <p className="mt-2 text-[10px] uppercase tracking-wide text-ink/30">Live data via Open-Meteo</p>
    </div>
  );
}
