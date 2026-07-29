import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { UserAuthProvider } from "./context/UserAuthContext.jsx";
import { WishlistProvider } from "./context/WishlistContext.jsx";
import { TripProvider } from "./context/TripContext.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <UserAuthProvider>
          <WishlistProvider>
            <TripProvider>
              <App />
            </TripProvider>
          </WishlistProvider>
        </UserAuthProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
