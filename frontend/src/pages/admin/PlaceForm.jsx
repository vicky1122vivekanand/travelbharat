import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Plus, X } from "lucide-react";
import { PlacesAPI, StatesAPI, CitiesAPI, CategoriesAPI } from "../../api/services";

const emptyForm = {
  name: "",
  slug: "",
  state: "",
  city: "",
  categories: [],
  shortDescription: "",
  description: "",
  historicalSignificance: "",
  bestTimeToVisit: "",
  timings: "",
  entryFee: { indian: "Free", foreigner: "Free" },
  budgetLevel: "Mid-range",
  recommendedDuration: "Half day",
  suitableFor: [],
  seasonalTags: [],
  isFeaturedOffer: false,
  offerText: "",
  isHiddenGem: false,
  hiddenGemNote: "",
  nearbyHotels: [],
  nearbyRestaurants: [],
  famousFood: [],
  localTransport: [],
  location: { address: "", mapLink: "" },
  externalBookingLink: "",
  images: [{ url: "", isCover: true }],
  isVerified: false,
  isPublished: true,
};

const SUITABLE_OPTIONS = ["Family", "Couple", "Solo", "Group"];
const SEASON_OPTIONS = ["Summer", "Winter", "Monsoon", "Year-round"];

export default function PlaceForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Inline "add new city" state
  const [showNewCity, setShowNewCity] = useState(false);
  const [newCityName, setNewCityName] = useState("");
  const [addingCity, setAddingCity] = useState(false);

  useEffect(() => {
    StatesAPI.list().then(setStates);
    CategoriesAPI.list().then(setCategories);
  }, []);

  // If editing, fetch the full place list and find this one
  // (kept simple for a scaffold; swap for a GET /places/id endpoint in production)
  useEffect(() => {
    if (!isEdit) return;
    PlacesAPI.list({ limit: 100 }).then((d) => {
      const place = d.places.find((p) => p._id === id);
      if (place) {
        setForm({
          ...emptyForm,
          ...place,
          state: place.state?._id,
          city: place.city?._id,
          categories: place.categories?.map((c) => c._id) || [],
          entryFee: place.entryFee || emptyForm.entryFee,
          location: place.location || emptyForm.location,
          nearbyHotels: place.nearbyHotels || [],
          nearbyRestaurants: place.nearbyRestaurants || [],
          famousFood: place.famousFood || [],
          localTransport: place.localTransport || [],
          suitableFor: place.suitableFor || [],
          seasonalTags: place.seasonalTags || [],
        });
      }
    });
  }, [id]);

  const refreshCities = (stateId) => {
    const slug = states.find((s) => s._id === stateId)?.slug;
    if (slug) CitiesAPI.list({ state: slug }).then(setCities);
  };

  useEffect(() => {
    if (form.state) refreshCities(form.state);
    else setCities([]);
    setShowNewCity(false);
  }, [form.state, states]);

  const slugify = (str) => str.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const toggleCategory = (catId) => {
    setForm((f) => ({
      ...f,
      categories: f.categories.includes(catId)
        ? f.categories.filter((c) => c !== catId)
        : [...f.categories, catId],
    }));
  };

  const toggleListValue = (field, value) => {
    setForm((f) => ({
      ...f,
      [field]: f[field].includes(value) ? f[field].filter((v) => v !== value) : [...f[field], value],
    }));
  };

  const handleAddCity = async () => {
    if (!newCityName.trim() || !form.state) return;
    setAddingCity(true);
    try {
      const city = await CitiesAPI.create({
        name: newCityName.trim(),
        slug: slugify(newCityName),
        state: form.state,
      });
      await refreshCities(form.state);
      setForm((f) => ({ ...f, city: city._id }));
      setNewCityName("");
      setShowNewCity(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add city");
    } finally {
      setAddingCity(false);
    }
  };

  // Generic helpers for repeatable rows (hotels / restaurants / food)
  const addRow = (field, emptyRow) => setForm((f) => ({ ...f, [field]: [...f[field], emptyRow] }));
  const updateRow = (field, index, key, value) =>
    setForm((f) => ({
      ...f,
      [field]: f[field].map((row, i) => (i === index ? { ...row, [key]: value } : row)),
    }));
  const removeRow = (field, index) =>
    setForm((f) => ({ ...f, [field]: f[field].filter((_, i) => i !== index) }));

  // Local transport is a simple string list
  const [newTransport, setNewTransport] = useState("");
  const addTransport = () => {
    if (!newTransport.trim()) return;
    setForm((f) => ({ ...f, localTransport: [...f.localTransport, newTransport.trim()] }));
    setNewTransport("");
  };
  const removeTransport = (i) =>
    setForm((f) => ({ ...f, localTransport: f.localTransport.filter((_, idx) => idx !== i) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = { ...form, slug: form.slug || slugify(form.name) };
      if (isEdit) await PlacesAPI.update(id, payload);
      else await PlacesAPI.create(payload);
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save place");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <h1 className="font-display text-2xl text-indigo">{isEdit ? "Edit" : "Add"} Tourist Place</h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Place Name">
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" />
          </Field>
          <Field label="Slug (auto if blank)">
            <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="input" placeholder="amber-fort" />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="State">
            <select required value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value, city: "" })} className="input">
              <option value="">Select state</option>
              {states.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
            </select>
          </Field>
          <Field label="City">
            {!form.state ? (
              <p className="mt-2 text-xs text-ink/40">Select a state first.</p>
            ) : (
              <>
                <select required={!showNewCity} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="input">
                  <option value="">
                    {cities.length === 0 ? "No cities yet for this state" : "Select city"}
                  </option>
                  {cities.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>

                {!showNewCity ? (
                  <button
                    type="button"
                    onClick={() => setShowNewCity(true)}
                    className="mt-2 flex items-center gap-1 text-xs font-semibold text-peacock hover:underline"
                  >
                    <Plus className="h-3 w-3" /> Add a new city for this state
                  </button>
                ) : (
                  <div className="mt-2 flex gap-2">
                    <input
                      value={newCityName}
                      onChange={(e) => setNewCityName(e.target.value)}
                      placeholder="New city name"
                      className="input"
                    />
                    <button
                      type="button"
                      disabled={addingCity}
                      onClick={handleAddCity}
                      className="btn-primary !px-3 !py-2 text-xs whitespace-nowrap"
                    >
                      {addingCity ? "Adding…" : "Add"}
                    </button>
                    <button type="button" onClick={() => setShowNewCity(false)} className="text-ink/40 hover:text-maroon">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </Field>
        </div>

        <Field label="Categories">
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                type="button"
                key={c._id}
                onClick={() => toggleCategory(c._id)}
                className={`chip ${form.categories.includes(c._id) ? "chip-active" : ""}`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Short Description (max 250 chars)">
          <textarea
            required
            maxLength={250}
            value={form.shortDescription}
            onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
            className="input"
            rows={2}
          />
        </Field>

        <Field label="Full Description">
          <textarea
            required
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="input"
            rows={5}
          />
        </Field>

        <Field label="Historical Significance (optional)">
          <textarea
            value={form.historicalSignificance}
            onChange={(e) => setForm({ ...form, historicalSignificance: e.target.value })}
            className="input"
            rows={3}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Best Time to Visit">
            <input value={form.bestTimeToVisit} onChange={(e) => setForm({ ...form, bestTimeToVisit: e.target.value })} className="input" placeholder="October - March" />
          </Field>
          <Field label="Timings">
            <input value={form.timings} onChange={(e) => setForm({ ...form, timings: e.target.value })} className="input" placeholder="6:00 AM - 6:00 PM" />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Entry Fee — Indian">
            <input
              value={form.entryFee.indian}
              onChange={(e) => setForm({ ...form, entryFee: { ...form.entryFee, indian: e.target.value } })}
              className="input"
            />
          </Field>
          <Field label="Entry Fee — Foreigner">
            <input
              value={form.entryFee.foreigner}
              onChange={(e) => setForm({ ...form, entryFee: { ...form.entryFee, foreigner: e.target.value } })}
              className="input"
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Budget Level">
            <select value={form.budgetLevel} onChange={(e) => setForm({ ...form, budgetLevel: e.target.value })} className="input">
              <option value="Budget">Budget</option>
              <option value="Mid-range">Mid-range</option>
              <option value="Luxury">Luxury</option>
            </select>
          </Field>
          <Field label="Recommended Duration">
            <input
              value={form.recommendedDuration}
              onChange={(e) => setForm({ ...form, recommendedDuration: e.target.value })}
              className="input"
              placeholder="Half day / 1 day / 2-3 days"
            />
          </Field>
        </div>

        <Field label="Suitable For">
          <div className="flex flex-wrap gap-2">
            {SUITABLE_OPTIONS.map((opt) => (
              <button
                type="button"
                key={opt}
                onClick={() => toggleListValue("suitableFor", opt)}
                className={`chip ${form.suitableFor.includes(opt) ? "chip-active" : ""}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Seasonal Tags (for Home page recommendations)">
          <div className="flex flex-wrap gap-2">
            {SEASON_OPTIONS.map((opt) => (
              <button
                type="button"
                key={opt}
                onClick={() => toggleListValue("seasonalTags", opt)}
                className={`chip ${form.seasonalTags.includes(opt) ? "chip-active" : ""}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Address">
            <input
              value={form.location.address}
              onChange={(e) => setForm({ ...form, location: { ...form.location, address: e.target.value } })}
              className="input"
            />
          </Field>
          <Field label="Google Maps Link">
            <input
              value={form.location.mapLink}
              onChange={(e) => setForm({ ...form, location: { ...form.location, mapLink: e.target.value } })}
              className="input"
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Latitude (for weather widget)">
            <input
              type="number"
              step="any"
              value={form.location.lat ?? ""}
              onChange={(e) => setForm({ ...form, location: { ...form.location, lat: e.target.value ? Number(e.target.value) : undefined } })}
              className="input"
            />
          </Field>
          <Field label="Longitude (for weather widget)">
            <input
              type="number"
              step="any"
              value={form.location.lng ?? ""}
              onChange={(e) => setForm({ ...form, location: { ...form.location, lng: e.target.value ? Number(e.target.value) : undefined } })}
              className="input"
            />
          </Field>
        </div>

        <Field label="Cover Image URL">
          <input
            value={form.images[0]?.url || ""}
            onChange={(e) => setForm({ ...form, images: [{ url: e.target.value, isCover: true }] })}
            className="input"
            placeholder="https://…"
          />
        </Field>

        <Field label="External Booking Link (optional — no payments processed on this platform)">
          <input
            value={form.externalBookingLink}
            onChange={(e) => setForm({ ...form, externalBookingLink: e.target.value })}
            className="input"
            placeholder="https://booking-partner.example.com/..."
          />
        </Field>

        {/* Nearby Hotels */}
        <RepeatableSection
          title="Nearby Hotels"
          rows={form.nearbyHotels}
          onAdd={() => addRow("nearbyHotels", { name: "", priceRange: "", distanceKm: "" })}
          onRemove={(i) => removeRow("nearbyHotels", i)}
          renderRow={(row, i) => (
            <>
              <input placeholder="Hotel name" value={row.name} onChange={(e) => updateRow("nearbyHotels", i, "name", e.target.value)} className="input" />
              <input placeholder="Price range (₹1500 - ₹3000/night)" value={row.priceRange} onChange={(e) => updateRow("nearbyHotels", i, "priceRange", e.target.value)} className="input" />
              <input type="number" placeholder="Distance (km)" value={row.distanceKm} onChange={(e) => updateRow("nearbyHotels", i, "distanceKm", e.target.value)} className="input" />
            </>
          )}
        />

        {/* Nearby Restaurants */}
        <RepeatableSection
          title="Nearby Restaurants"
          rows={form.nearbyRestaurants}
          onAdd={() => addRow("nearbyRestaurants", { name: "", cuisine: "", priceRange: "", distanceKm: "" })}
          onRemove={(i) => removeRow("nearbyRestaurants", i)}
          renderRow={(row, i) => (
            <>
              <input placeholder="Restaurant name" value={row.name} onChange={(e) => updateRow("nearbyRestaurants", i, "name", e.target.value)} className="input" />
              <input placeholder="Cuisine" value={row.cuisine} onChange={(e) => updateRow("nearbyRestaurants", i, "cuisine", e.target.value)} className="input" />
              <input placeholder="Price (₹ / ₹₹ / ₹₹₹)" value={row.priceRange} onChange={(e) => updateRow("nearbyRestaurants", i, "priceRange", e.target.value)} className="input" />
              <input type="number" placeholder="Distance (km)" value={row.distanceKm} onChange={(e) => updateRow("nearbyRestaurants", i, "distanceKm", e.target.value)} className="input" />
            </>
          )}
        />

        {/* Famous Food */}
        <RepeatableSection
          title="Famous Food to Try"
          rows={form.famousFood}
          onAdd={() => addRow("famousFood", { name: "", description: "" })}
          onRemove={(i) => removeRow("famousFood", i)}
          renderRow={(row, i) => (
            <>
              <input placeholder="Dish name" value={row.name} onChange={(e) => updateRow("famousFood", i, "name", e.target.value)} className="input" />
              <input placeholder="Short description" value={row.description} onChange={(e) => updateRow("famousFood", i, "description", e.target.value)} className="input sm:col-span-2" />
            </>
          )}
        />

        {/* Local Transport */}
        <Field label="Local Transport Options">
          <div className="mb-2 flex flex-wrap gap-2">
            {form.localTransport.map((t, i) => (
              <span key={i} className="chip chip-active flex items-center gap-1">
                {t}
                <button type="button" onClick={() => removeTransport(i)}><X className="h-3 w-3" /></button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={newTransport}
              onChange={(e) => setNewTransport(e.target.value)}
              placeholder="e.g. Auto-rickshaw"
              className="input"
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTransport())}
            />
            <button type="button" onClick={addTransport} className="btn-outline !px-3 !py-2 text-xs whitespace-nowrap">
              <Plus className="h-3 w-3" /> Add
            </button>
          </div>
        </Field>

        {/* Hidden Gem */}
        <Field label="Hidden Gem (optional)">
          <label className="mb-2 flex items-center gap-2 text-sm text-ink/70">
            <input
              type="checkbox"
              checked={form.isHiddenGem}
              onChange={(e) => setForm({ ...form, isHiddenGem: e.target.checked })}
            />
            Promote this as a lesser-known "Hidden Gem" on the homepage
          </label>
          {form.isHiddenGem && (
            <input
              value={form.hiddenGemNote}
              onChange={(e) => setForm({ ...form, hiddenGemNote: e.target.value })}
              className="input"
              placeholder="e.g. Rarely visited — no crowds even in peak season"
            />
          )}
        </Field>

        {/* Special Offer */}
        <Field label="Special Offer (optional)">
          <label className="mb-2 flex items-center gap-2 text-sm text-ink/70">
            <input
              type="checkbox"
              checked={form.isFeaturedOffer}
              onChange={(e) => setForm({ ...form, isFeaturedOffer: e.target.checked })}
            />
            Feature this as a Special Offer on the homepage
          </label>
          {form.isFeaturedOffer && (
            <input
              value={form.offerText}
              onChange={(e) => setForm({ ...form, offerText: e.target.value })}
              className="input"
              placeholder="e.g. 20% off houseboat stays this month"
            />
          )}
        </Field>

        <label className="flex items-center gap-2 text-sm text-ink/70">
          <input
            type="checkbox"
            checked={form.isVerified}
            onChange={(e) => setForm({ ...form, isVerified: e.target.checked })}
          />
          Mark as verified
        </label>

        {error && <p className="text-sm text-maroon">{error}</p>}

        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? "Saving…" : isEdit ? "Update Place" : "Create Place"}
        </button>
      </form>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink/60">{label}</label>
      {children}
    </div>
  );
}

function RepeatableSection({ title, rows, onAdd, onRemove, renderRow }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wide text-ink/60">{title}</label>
        <button type="button" onClick={onAdd} className="flex items-center gap-1 text-xs font-semibold text-peacock hover:underline">
          <Plus className="h-3 w-3" /> Add
        </button>
      </div>
      {rows.length === 0 && <p className="text-xs text-ink/40">None added yet.</p>}
      <div className="space-y-2">
        {rows.map((row, i) => (
          <div key={i} className="grid grid-cols-1 gap-2 rounded-sm border border-ink/10 p-3 sm:grid-cols-3">
            {renderRow(row, i)}
            <button type="button" onClick={() => onRemove(i)} className="text-xs font-semibold text-maroon hover:underline sm:col-span-3 sm:text-right">
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
