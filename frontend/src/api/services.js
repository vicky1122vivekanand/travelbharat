import client from "./client";

export const StatesAPI = {
  list: (params) => client.get("/states", { params }).then((r) => r.data),
  getBySlug: (slug) => client.get(`/states/${slug}`).then((r) => r.data),
  create: (data) => client.post("/states", data).then((r) => r.data),
  update: (id, data) => client.put(`/states/${id}`, data).then((r) => r.data),
  remove: (id) => client.delete(`/states/${id}`).then((r) => r.data),
};

export const CitiesAPI = {
  list: (params) => client.get("/cities", { params }).then((r) => r.data),
  create: (data) => client.post("/cities", data).then((r) => r.data),
  update: (id, data) => client.put(`/cities/${id}`, data).then((r) => r.data),
  remove: (id) => client.delete(`/cities/${id}`).then((r) => r.data),
};

export const CategoriesAPI = {
  list: () => client.get("/categories").then((r) => r.data),
  create: (data) => client.post("/categories", data).then((r) => r.data),
  update: (id, data) => client.put(`/categories/${id}`, data).then((r) => r.data),
  remove: (id) => client.delete(`/categories/${id}`).then((r) => r.data),
};

export const PlacesAPI = {
  list: (params) => client.get("/places", { params }).then((r) => r.data),
  getBySlug: (slug) => client.get(`/places/${slug}`).then((r) => r.data),
  stats: () => client.get("/places/stats/summary").then((r) => r.data),
  create: (data) => client.post("/places", data).then((r) => r.data),
  update: (id, data) => client.put(`/places/${id}`, data).then((r) => r.data),
  remove: (id) => client.delete(`/places/${id}`).then((r) => r.data),
};

export const FestivalsAPI = {
  list: (params) => client.get("/festivals", { params }).then((r) => r.data),
  create: (data) => client.post("/festivals", data).then((r) => r.data),
  update: (id, data) => client.put(`/festivals/${id}`, data).then((r) => r.data),
  remove: (id) => client.delete(`/festivals/${id}`).then((r) => r.data),
};

export const AuthAPI = {
  login: (data) => client.post("/auth/login", data).then((r) => r.data),
  me: () => client.get("/auth/me").then((r) => r.data),
};
