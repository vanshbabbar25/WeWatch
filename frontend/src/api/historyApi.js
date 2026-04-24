import axios from "axios";

axios.defaults.withCredentials = true;

// history routes

export const addToHistory = (movie) =>
    axios.post("/api/history/add", movie);

export const getHistory = () =>
    axios.get("/api/history");

export const removeFromHistory = (movieId) =>
    axios.delete(`/api/history/${movieId}`);