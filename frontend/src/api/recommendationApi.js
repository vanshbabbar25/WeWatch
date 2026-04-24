/**
 * api/recommendationApi.js
 * -------------------------
 * All HTTP calls to the WeWatch recommendation backend.
 * Uses Axios with the base URL from your existing axiosInstance or env.
 */

import axios from "axios";

const API = axios.create({
  baseURL: "/api",        // ✅ use proxy
  withCredentials: true,  // ✅ send cookies
});

// Attach JWT token from localStorage if your app uses Bearer tokens
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("wewatch_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/** POST /recommendations/watch  — record a watched movie */
export const postWatchedMovie = (movie) =>
  API.post("/recommendations/watch", movie);

/** GET  /recommendations/history — last 3 watched movies */
export const fetchWatchHistory = () =>
  API.get("/recommendations/history");

/** GET  /recommendations — top-10 recommendations */
export const fetchRecommendations = () =>
  API.get("/recommendations");

export default API;