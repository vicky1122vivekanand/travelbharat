import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// Route-level code splitting: each page ships as its own chunk, keeping the
// initial bundle small for a faster first load (KPI: page load time ≤ 2s).
const Home = lazy(() => import("./pages/Home"));
const StatesList = lazy(() => import("./pages/StatesList"));
const StateDetail = lazy(() => import("./pages/StateDetail"));
const Explore = lazy(() => import("./pages/Explore"));
const PlaceDetail = lazy(() => import("./pages/PlaceDetail"));
const Toolkit = lazy(() => import("./pages/Toolkit"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const TripPlanner = lazy(() => import("./pages/TripPlanner"));
const EmergencyContacts = lazy(() => import("./pages/EmergencyContacts"));
const Signup = lazy(() => import("./pages/Signup"));
const Login = lazy(() => import("./pages/Login"));
const Profile = lazy(() => import("./pages/Profile"));
const ForStudents = lazy(() => import("./pages/ForStudents"));
const About = lazy(() => import("./pages/About"));
const NotFound = lazy(() => import("./pages/NotFound"));

const AdminLogin = lazy(() => import("./pages/admin/Login"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const PlaceForm = lazy(() => import("./pages/admin/PlaceForm"));

function PageFallback() {
  return <div className="p-14 text-center text-ink/40">Loading…</div>;
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/states" element={<StatesList />} />
            <Route path="/states/:slug" element={<StateDetail />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/places/:slug" element={<PlaceDetail />} />
            <Route path="/toolkit" element={<Toolkit />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/trip-planner" element={<TripPlanner />} />
            <Route path="/emergency" element={<EmergencyContacts />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/for-students" element={<ForStudents />} />
            <Route path="/about" element={<About />} />

            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/places/new"
              element={
                <ProtectedRoute>
                  <PlaceForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/places/:id/edit"
              element={
                <ProtectedRoute>
                  <PlaceForm />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
