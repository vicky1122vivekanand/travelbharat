# TravelBharat — Explore India State by State

A digital travel encyclopedia of India: state-wise and city-wise tourist
destination listings with rich details, search & filters, image galleries,
and an admin panel for content management.

**Stack:** React + Vite + Tailwind CSS (frontend) · Node.js + Express + MongoDB (backend)

## Folder Structure

```
travelbharat/
├── backend/                   # Node.js + Express + MongoDB API
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/           # Route logic
│   │   ├── authController.js
│   │   ├── stateController.js
│   │   ├── cityController.js
│   │   ├── categoryController.js
│   │   └── placeController.js
│   ├── middleware/
│   │   ├── auth.js            # JWT protect + role guard
│   │   └── errorHandler.js
│   ├── models/                # Mongoose schemas
│   │   ├── State.js            (now includes coordinates + local cuisine)
│   │   ├── City.js
│   │   ├── Category.js
│   │   ├── TouristPlace.js
│   │   ├── Festival.js         # NEW — state-wise festivals/events
│   │   └── Admin.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── stateRoutes.js
│   │   ├── cityRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── placeRoutes.js
│   │   └── festivalRoutes.js   # NEW
│   ├── seed/
│   │   └── seed.js            # Sample data + demo admin
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/                  # React + Vite + Tailwind
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── api/
│   │   │   ├── client.js      # Axios instance
│   │   │   └── services.js    # API calls grouped by resource
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── PlaceCard.jsx
│   │   │   ├── StateCard.jsx
│   │   │   ├── CategoryFilter.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── WeatherWidget.jsx           # NEW — live weather via Open-Meteo
│   │   │   ├── FestivalCalendar.jsx        # NEW — state-wise events
│   │   │   ├── CuisineHighlights.jsx       # NEW — local food per state
│   │   │   ├── PackingChecklist.jsx        # NEW — trip checklist generator
│   │   │   └── CurrencyDistanceConverter.jsx # NEW — INR converter + km/mi
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── StatesList.jsx
│   │   │   ├── StateDetail.jsx             (now shows cuisine + festivals)
│   │   │   ├── Explore.jsx
│   │   │   ├── PlaceDetail.jsx             (now shows live weather)
│   │   │   ├── Toolkit.jsx                 # NEW — /toolkit page
│   │   │   ├── NotFound.jsx
│   │   │   └── admin/
│   │   │       ├── Login.jsx
│   │   │       ├── Dashboard.jsx
│   │   │       └── PlaceForm.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

## Getting Started

### 1. Backend

```bash
cd backend
cp .env.example .env      # update MONGO_URI and JWT_SECRET
npm install
npm run seed               # loads sample states/cities/places + demo admin
npm run dev                # starts API on http://localhost:5000
```

Demo admin login (created by the seed script):
`admin@travelbharat.in` / `Admin@123`

### 2. Frontend

```bash
cd frontend
npm install
npm run dev                 # starts app on http://localhost:5173
```

The Vite dev server proxies `/api` requests to `http://localhost:5000`, so no
extra CORS config is needed in development.

## Core Data Model

- **State** → name, region, capital, description
- **City** → belongs to a State
- **Category** → Heritage, Nature, Religious, Adventure (extensible)
- **TouristPlace** → belongs to a State + City, tagged with Categories;
  stores description, historical significance, best time to visit, timings,
  entry fees, location/map link, image gallery, and nearby attractions
- **Admin** → role-based (`superadmin` / `editor`) for content management

## API Overview

| Method | Endpoint                  | Description                          |
|--------|----------------------------|---------------------------------------|
| GET    | `/api/states`               | List states (filter by `region`)      |
| GET    | `/api/states/:slug`         | State detail + place count            |
| GET    | `/api/cities?state=slug`    | Cities in a state                     |
| GET    | `/api/categories`           | List categories                       |
| GET    | `/api/places`               | Search/filter places (`q`, `state`, `city`, `category`, `page`) |
| GET    | `/api/places/:slug`         | Place detail (increments view count)  |
| GET    | `/api/festivals?state=slug&month=` | State-wise festivals/events    |
| POST   | `/api/auth/login`           | Admin login → JWT                     |
| POST/PUT/DELETE | `/api/states`, `/api/cities`, `/api/categories`, `/api/places`, `/api/festivals` | Admin-only content management (JWT required) |

## Additional Features (beyond the original brief)

These weren't in the original requirements document, added on request to make
the platform more useful for trip planning:

- **Live weather widget** on each destination page — current temperature and
  today's high/low, fetched from [Open-Meteo](https://open-meteo.com) (free,
  no API key required).
- **Festival & Events calendar** — a new `Festival` entity, shown state-wise
  on the State detail page (e.g. Pushkar Camel Fair, Onam).
- **Local cuisine highlights** — a `cuisine` array on the State model,
  showcasing signature dishes per state.
- **Travel Toolkit page** (`/toolkit`) —
  - *Packing checklist generator*: pick a trip type (heritage/nature/religious/adventure)
    and season to get a tickable starter packing list (fully client-side).
  - *Currency & distance converter*: live INR → foreign currency conversion
    via [Frankfurter](https://frankfurter.app) (free, ECB reference rates,
    no API key), plus a simple km ↔ miles converter.

Re-run `npm run seed` after pulling these changes to load sample cuisine and
festival data for Rajasthan and Kerala.

## Round Two: Full State Coverage + Planning Tools

Added on further request:

- **All 28 states + 8 union territories** are now seeded (`backend/seed/seed.js`)
  — the States section (`/states`) always lists all 36, regardless of how
  much destination content an admin has added for each one yet.
- **10 preloaded showcase destinations** — Amber Fort, City Palace Udaipur,
  Alleppey Backwaters, Taj Mahal, Golden Temple, Varanasi Ghats, Baga Beach,
  Ranthambore National Park, Solang Valley, Hampi Ruins — spread across 7
  states so every category filter has real examples. These persist
  regardless of admin activity; admins can add more on top or edit/remove
  them from the dashboard.
- **4 new categories**: Pilgrimage, Wildlife, Beaches, Mountains (alongside
  existing Heritage, Nature, Religious, Adventure) — 8 total.
- **New Explore filters**: Budget (Budget/Mid-range/Luxury), Duration
  (Half day / 1 day / 2+ days), and Suitable For (Family/Couple/Solo/Group)
  — combinable with category, state, and keyword search.
- **Each destination page now includes**: nearby hotels (name, price range,
  distance), nearby restaurants (cuisine, price range, distance), famous
  local food to try, and local transport options.
- **Seasonal Recommendations** — homepage section that shows destinations
  matching the current real-world month (Winter/Summer/Monsoon), driven by
  each place's `seasonalTags`.
- **Special Offers** — homepage banner + a per-place `offerText` flag
  (`isFeaturedOffer`) for informational promos (no payment processing —
  still out of scope per the original brief).
- **Wishlist** (`/wishlist`) — heart-toggle on any destination card or
  detail page, stored in the browser's local storage, no login required.
- **Trip Planner** (`/trip-planner`) — build a day-by-day itinerary by
  adding destinations from their detail page; stored locally per device.
- **Emergency Contacts** (`/emergency`) — national helpline numbers
  (police, ambulance, fire, tourist helpline, etc.) and general travel
  safety tips.

New/changed backend fields on `TouristPlace`: `budgetLevel`,
`recommendedDuration`, `suitableFor`, `seasonalTags`, `isFeaturedOffer`,
`offerText`, `nearbyHotels`, `nearbyRestaurants`, `famousFood`,
`localTransport`. New fields on `State`: `coordinates`, `cuisine`.

## Round Three: Remaining Secondary Objectives + User Accounts

Re-run `npm install` in `backend/` to pick up the new `compression`
dependency, and `npm run seed` if you haven't already loaded the full
36-state / 11-place dataset from Round Two.


Added on further request — this closes out the objectives/requirements from
the original brief that hadn't been addressed yet:

- **User Login & Signup** — a full authentication system for regular users
  (`/signup`, `/login`, `/profile`), separate from the admin login. Backend:
  `User` model, `/api/users/*` routes, JWT-protected. When logged in, a
  user's **Wishlist** and **Trip Planner** sync to their account
  (`Wishlist` / `TripPlan` models) instead of just browser localStorage —
  anonymous browsing still works exactly as before and merges into the
  account on first login.
- **Support students in tourism-related projects** — new `/for-students`
  page: lists the public read-only API endpoints, sample project ideas,
  and citation guidance for coursework/research use.
- **Encourage domestic tourism awareness** — a homepage banner
  (`DomesticTourismBanner`) plus a fuller "Why Explore India?" section on
  the new `/about` page.
- **Scalable base for future booking integrations** — added an optional
  `externalBookingLink` field per destination (admin-editable). When set,
  a "Check Availability" button appears on the place page, linking out to
  a third-party provider. No payment processing happens on this platform —
  this is intentionally just the integration hook the brief asked for.
- **Fast page load / optimized images** — route-level code splitting via
  `React.lazy` + `Suspense` (each page ships as its own JS chunk), and
  `loading="lazy"` / `decoding="async"` on all below-the-fold images.
  Backend responses are now gzip-compressed (`compression` middleware).
- **SEO-friendly architecture** — a `useDocumentTitle` hook sets a unique
  `<title>` and meta description per page; added `robots.txt` and a base
  `sitemap.xml`. Note: this is still a client-rendered SPA, so for full
  crawlability in production, pair this with server-side rendering or
  pre-rendering (e.g. Next.js, vite-plugin-ssr) and generate the sitemap
  dynamically from `/api/states` + `/api/places`.
- **Scalable system design** — gzip compression, existing Mongoose indexes
  (text search, state/city/category, festival state+month), stateless JWT
  auth (horizontally scalable, no server-side sessions), and pagination on
  all list endpoints.
- **KPI dashboard** — the admin dashboard now surfaces the KPIs that are
  computable from in-app data: **Content Accuracy Rate** (verified ÷ total
  places, target ≥ 95%), **Total Destination Views** (engagement proxy),
  and **New Places (30 Days)** (content growth). Monthly active users and
  bounce rate need an external analytics tool (Google Analytics, Plausible,
  etc.) — noted directly in the dashboard rather than faked.
- **Assumptions & Constraints** — now stated transparently to end users on
  the `/about` page (informational-only content, manual verification,
  limited multilingual support, etc.), not just in this README.

New backend models: `User`, `Wishlist`, `TripPlan`. New routes: `/api/users/*`.
New env consideration: none — reuses existing `JWT_SECRET`.

## Bugfixes

- **City dropdown empty after selecting a state** — root cause: only 7 of
  the 36 seeded states had cities attached. Fixed by adding an inline
  **"+ Add a new city for this state"** option directly in the admin place
  form (`PlaceForm.jsx`), so admins are never blocked waiting on seed data.
- **Wrong/broken cover images** (Taj Mahal photo showing on the City Palace
  Udaipur page; Golden Temple image not loading) — root cause: a couple of
  hand-picked Unsplash photo IDs in the seed data were mismatched or
  invalid. All 10 destination cover images (plus the homepage hero) were
  replaced with verified, correctly-labelled Wikimedia Commons photos
  (CC-licensed), fetched via `Special:FilePath` for stable hotlinking.
  Re-run `npm run seed` to load the corrected images.
- **No way to add nearby hotels / restaurants / famous food / local
  transport from the admin UI** — these fields existed on the backend
  model but had no form inputs. `PlaceForm.jsx` now has full add/remove
  UI for all four, plus budget level, recommended duration, suitable-for
  tags, seasonal tags, and the special-offer flag.
- **"Promote lesser-known destinations" (a Secondary Objective in the
  original brief) was never actually implemented** — all 10 preloaded
  places were famous, well-known sites. Fixed by adding an `isHiddenGem`
  flag + `hiddenGemNote` field on `TouristPlace` (admin-togglable, same
  pattern as the Special Offer flag), a new **"Hidden Gems Worth
  Discovering"** section on the homepage, and one genuine lesser-known
  destination in the seed data — **Mawlynnong Village, Meghalaya** (Asia's
  cleanest village), which rarely appears on standard India itineraries.

## Out of Scope (Phase One)

Bookings, payments, live availability, and user reviews are intentionally
excluded per the project scope — this is an informational platform, with a
schema designed to support those features in future phases.

## Future Enhancements

- Map-based exploration (Google Maps integration)
- Multilingual support (Hindi & regional languages)
- Travel itinerary planner
- Hotel & transport integrations
- User reviews and ratings
