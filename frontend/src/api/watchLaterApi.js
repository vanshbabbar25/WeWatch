import axios from "axios";

axios.defaults.withCredentials = true;

export const addToWatchLater = (movie) =>
    axios.post("/api/watch-later/add", movie);

export const getWatchLater = () =>
    axios.get("/api/watch-later");

export const removeFromWatchLater = (movieId) =>
    axios.delete(`/api/watch-later/${movieId}`);

