import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Clock, Ticket, CalendarDays, MapPin, ExternalLink, Hotel, UtensilsCrossed, Bus, Star, Heart, PlusCircle, Wallet, Users } from "lucide-react";
import { PlacesAPI } from "../api/services";
import PlaceCard from "../components/PlaceCard";
import WeatherWidget from "../components/WeatherWidget";
import { useWishlist } from "../context/WishlistContext";
import { useTrip } from "../context/TripContext";
import useDocumentTitle from "../hooks/useDocumentTitle";

export default function PlaceDetail() {
  const { slug } = useParams();
  const [place, setPlace] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { days, addPlaceToDay } = useTrip();
  const [selectedDay, setSelectedDay] = useState("");
  useDocumentTitle(place?.name, place?.shortDescription);

  useEffect(() => {
    setPlace(null);
    PlacesAPI.getBySlug(slug).then(setPlace);
    window.scrollTo(0, 0);
  }, [slug]);

  if (!place) return <div className="p-14 text-center text-ink/50">Loading destination…</div>;

  const images = place.images?.length ? place.images : [{ url: "" }];

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      {/* Breadcrumb */}
      <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-ink/50">
        <Link to="/states" className="hover:text-maroon">States</Link> /{" "}
        <Link to={`/states/${place.state?.slug}`} className="hover:text-maroon">{place.state?.name}</Link> /{" "}
        <span className="text-ink">{place.name}</span>
      </p>

      <div className="grid gap-10 lg:grid-cols-3">
        {/* Gallery + description */}
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-sm border border-ink/10 bg-ink/5">
            <img src={images[activeImage]?.url} alt={place.name} loading="eager" className="h-80 w-full object-cover md:h-[420px]" />
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`h-16 w-24 flex-shrink-0 overflow-hidden rounded-sm border-2 ${
                    i === activeImage ? "border-marigold" : "border-transparent"
                  }`}
                >
                  <img src={img.url} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <h1 className="mt-8 font-display text-3xl text-indigo">{place.name}</h1>
          <div className="mt-2 flex flex-wrap gap-2">
            {place.categories?.map((c) => (
              <span key={c._id} className="chip">{c.name}</span>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={() => toggleWishlist(place)}
              className={`inline-flex items-center gap-2 rounded-sm border px-4 py-2 text-sm font-semibold transition-colors ${
                isWishlisted(place._id) ? "border-maroon bg-maroon/10 text-maroon" : "border-ink/20 text-ink/70 hover:border-ink/50"
              }`}
            >
              <Heart className={`h-4 w-4 ${isWishlisted(place._id) ? "fill-maroon" : ""}`} />
              {isWishlisted(place._id) ? "Saved to Wishlist" : "Add to Wishlist"}
            </button>

            <div className="flex items-center gap-2">
              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                className="rounded-sm border border-ink/15 bg-white/60 px-2 py-2 text-sm"
              >
                <option value="">Add to trip day…</option>
                {days.map((d) => (
                  <option key={d.id} value={d.id}>{d.label}</option>
                ))}
              </select>
              <button
                disabled={!selectedDay}
                onClick={() => selectedDay && addPlaceToDay(selectedDay, place)}
                className="inline-flex items-center gap-2 rounded-sm bg-peacock px-4 py-2 text-sm font-semibold text-paper transition-colors hover:bg-peacock-dark disabled:opacity-40"
              >
                <PlusCircle className="h-4 w-4" /> Add to Trip
              </button>
            </div>
          </div>

          <p className="mt-5 leading-relaxed text-ink/80">{place.description}</p>

          {place.historicalSignificance && (
            <div className="mt-6 border-l-4 border-marigold bg-marigold/10 p-4">
              <h3 className="mb-1 font-display text-base text-indigo">Historical Significance</h3>
              <p className="text-sm text-ink/70">{place.historicalSignificance}</p>
            </div>
          )}

          {(place.famousFood?.length > 0 || place.nearbyHotels?.length > 0 || place.nearbyRestaurants?.length > 0 || place.localTransport?.length > 0) && (
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {place.famousFood?.length > 0 && (
                <div className="rounded-sm border border-ink/10 bg-white/50 p-5">
                  <h3 className="mb-3 flex items-center gap-2 font-display text-base text-indigo">
                    <UtensilsCrossed className="h-4 w-4 text-maroon" /> Famous Food to Try
                  </h3>
                  <ul className="space-y-2 text-sm text-ink/70">
                    {place.famousFood.map((f, i) => (
                      <li key={i}>
                        <span className="font-semibold text-ink/90">{f.name}</span>
                        {f.description && <span> — {f.description}</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {place.localTransport?.length > 0 && (
                <div className="rounded-sm border border-ink/10 bg-white/50 p-5">
                  <h3 className="mb-3 flex items-center gap-2 font-display text-base text-indigo">
                    <Bus className="h-4 w-4 text-peacock" /> Getting Around Locally
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {place.localTransport.map((t, i) => (
                      <span key={i} className="chip">{t}</span>
                    ))}
                  </div>
                </div>
              )}

              {place.nearbyHotels?.length > 0 && (
                <div className="rounded-sm border border-ink/10 bg-white/50 p-5 sm:col-span-2">
                  <h3 className="mb-3 flex items-center gap-2 font-display text-base text-indigo">
                    <Hotel className="h-4 w-4 text-peacock" /> Nearby Hotels
                  </h3>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {place.nearbyHotels.map((h, i) => (
                      <div key={i} className="flex items-center justify-between rounded-sm bg-ink/5 px-3 py-2 text-sm">
                        <div>
                          <p className="font-semibold text-ink/90">{h.name}</p>
                          {h.priceRange && <p className="text-xs text-ink/60">{h.priceRange}</p>}
                        </div>
                        {h.distanceKm != null && <span className="text-xs text-ink/50">{h.distanceKm} km</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {place.nearbyRestaurants?.length > 0 && (
                <div className="rounded-sm border border-ink/10 bg-white/50 p-5 sm:col-span-2">
                  <h3 className="mb-3 flex items-center gap-2 font-display text-base text-indigo">
                    <Star className="h-4 w-4 text-marigold" /> Nearby Restaurants
                  </h3>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {place.nearbyRestaurants.map((r, i) => (
                      <div key={i} className="flex items-center justify-between rounded-sm bg-ink/5 px-3 py-2 text-sm">
                        <div>
                          <p className="font-semibold text-ink/90">{r.name}</p>
                          <p className="text-xs text-ink/60">{r.cuisine}{r.priceRange ? ` · ${r.priceRange}` : ""}</p>
                        </div>
                        {r.distanceKm != null && <span className="text-xs text-ink/50">{r.distanceKm} km</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {place.nearbyAttractions?.length > 0 && (
            <div className="mt-10">
              <h2 className="mb-4 font-display text-xl text-indigo">Nearby Attractions</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {place.nearbyAttractions
                  .filter((n) => n.place)
                  .map((n) => (
                    <div key={n.place._id} className="relative">
                      <PlaceCard place={n.place} />
                      {n.distanceKm && (
                        <span className="absolute right-3 top-3 rounded-full bg-ink/70 px-2 py-0.5 text-xs text-paper">
                          {n.distanceKm} km
                        </span>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Info panel */}
        <aside className="h-fit space-y-4">
          {place.location?.lat != null && place.location?.lng != null && (
            <WeatherWidget lat={place.location.lat} lng={place.location.lng} label={place.name} />
          )}

          <div className="rounded-sm border border-ink/10 bg-white/50 p-6">
          <h2 className="mb-4 font-display text-lg text-indigo">Visitor Information</h2>
          {place.isFeaturedOffer && place.offerText && (
            <div className="mb-4 rounded-sm bg-marigold/15 p-3 text-xs font-semibold text-marigold-dark">
              🎉 Special Offer: {place.offerText}
            </div>
          )}
          <ul className="space-y-4 text-sm">
            <li className="flex gap-3">
              <Wallet className="mt-0.5 h-4 w-4 flex-shrink-0 text-peacock" />
              <div>
                <p className="font-semibold text-ink/80">Budget Level</p>
                <p className="text-ink/60">{place.budgetLevel} · {place.recommendedDuration}</p>
              </div>
            </li>
            {place.suitableFor?.length > 0 && (
              <li className="flex gap-3">
                <Users className="mt-0.5 h-4 w-4 flex-shrink-0 text-peacock" />
                <div>
                  <p className="font-semibold text-ink/80">Best Suited For</p>
                  <p className="text-ink/60">{place.suitableFor.join(", ")}</p>
                </div>
              </li>
            )}
            <li className="flex gap-3">
              <CalendarDays className="mt-0.5 h-4 w-4 flex-shrink-0 text-peacock" />
              <div>
                <p className="font-semibold text-ink/80">Best Time to Visit</p>
                <p className="text-ink/60">{place.bestTimeToVisit || "Year-round"}</p>
              </div>
            </li>
            <li className="flex gap-3">
              <Clock className="mt-0.5 h-4 w-4 flex-shrink-0 text-peacock" />
              <div>
                <p className="font-semibold text-ink/80">Timings</p>
                <p className="text-ink/60">{place.timings || "Not specified"}</p>
              </div>
            </li>
            <li className="flex gap-3">
              <Ticket className="mt-0.5 h-4 w-4 flex-shrink-0 text-peacock" />
              <div>
                <p className="font-semibold text-ink/80">Entry Fee</p>
                <p className="text-ink/60">
                  Indian: {place.entryFee?.indian || "Free"} · Foreigner: {place.entryFee?.foreigner || "Free"}
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-peacock" />
              <div>
                <p className="font-semibold text-ink/80">Location</p>
                <p className="text-ink/60">{place.location?.address}</p>
                {place.location?.mapLink && (
                  <a
                    href={place.location.mapLink}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-maroon hover:underline"
                  >
                    View on map <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </li>
          </ul>

          {place.externalBookingLink && (
            <a
              href={place.externalBookingLink}
              target="_blank"
              rel="noreferrer"
              className="btn-primary mt-5 w-full justify-center"
            >
              Check Availability
            </a>
          )}
          </div>
        </aside>
      </div>
    </div>
  );
}
