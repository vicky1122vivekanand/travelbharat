import client from "./client";

export const UsersAPI = {
  register: (data) => client.post("/users/register", data).then((r) => r.data),
  login: (data) => client.post("/users/login", data).then((r) => r.data),
  me: () => client.get("/users/me").then((r) => r.data),
  getWishlist: () => client.get("/users/wishlist").then((r) => r.data),
  setWishlist: (placeIds) => client.put("/users/wishlist", { placeIds }).then((r) => r.data),
  getTripPlan: () => client.get("/users/trip-plan").then((r) => r.data),
  setTripPlan: (days) => client.put("/users/trip-plan", { days }).then((r) => r.data),
};
