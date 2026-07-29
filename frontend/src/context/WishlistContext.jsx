import { createContext, useContext, useEffect, useState } from "react";
import { UsersAPI } from "../api/userServices";
import { useUserAuth } from "./UserAuthContext";

const WishlistContext = createContext(null);
const STORAGE_KEY = "tb_wishlist";

export function WishlistProvider({ children }) {
  const { user } = useUserAuth();
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);

  // Load from backend when logged in, otherwise from localStorage
  useEffect(() => {
    if (user) {
      UsersAPI.getWishlist()
        .then(async (backendItems) => {
          // One-time merge: if backend is empty but local storage has items
          // (e.g. user just signed up after browsing anonymously), push them up.
          if (backendItems.length === 0) {
            try {
              const local = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
              if (local.length > 0) {
                await UsersAPI.setWishlist(local.map((p) => p._id));
                setItems(local);
                setLoaded(true);
                return;
              }
            } catch {
              /* ignore malformed local storage */
            }
          }
          setItems(backendItems);
          setLoaded(true);
        })
        .catch(() => setLoaded(true));
    } else {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        setItems(stored ? JSON.parse(stored) : []);
      } catch {
        setItems([]);
      }
      setLoaded(true);
    }
  }, [user]);

  const persist = (next) => {
    setItems(next);
    if (user) {
      UsersAPI.setWishlist(next.map((p) => p._id)).catch(() => {});
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    }
  };

  const isWishlisted = (placeId) => items.some((i) => i._id === placeId);

  const toggleWishlist = (place) => {
    if (isWishlisted(place._id)) {
      persist(items.filter((i) => i._id !== place._id));
    } else {
      persist([...items, place]);
    }
  };

  const removeFromWishlist = (placeId) => persist(items.filter((i) => i._id !== placeId));

  return (
    <WishlistContext.Provider value={{ items, loaded, isWishlisted, toggleWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
