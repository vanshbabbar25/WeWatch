import axios from 'axios';
const TMDB_BASE = "https://api.themoviedb.org/3";

/**
 * Fetch candidate movies from TMDB discover endpoint.
 *
 * @param {number[]} genreIds - Top genre IDs to filter by
 * @param {number}   pages    - How many pages to fetch (each page = 20 movies)
 * @returns {Promise<Object[]>} - Deduplicated array of TMDB movie objects
 */
async function fetchCandidatesFromTMDB(genreIds, pages = 3) {
  if (!process.env.TMDB_API_KEY) {
    throw new Error("TMDB_API_KEY is not set in environment variables");
  }

  const genreParam = genreIds.join(",");

  // Fire all page requests in parallel
  const requests = Array.from({ length: pages }, (_, i) =>
    axios.get(`${TMDB_BASE}/discover/movie`, {
      params: {
        api_key: process.env.TMDB_API_KEY,
        with_genres: genreParam,
        sort_by: "popularity.desc",
        page: i + 1,
        "vote_count.gte": 50,
        language: "en-US",
      },
      timeout: 8000,
    })
  );

  const responses = await Promise.allSettled(requests);

  const results = [];
  for (const res of responses) {
    if (res.status === "fulfilled") {
      results.push(...(res.value.data.results || []));
    }
  }
  // Deduplicate by TMDB id
  const unique = Array.from(
    new Map(results.map((m) => [m.id, m])).values()
  );

  return unique;
}

/**
 * Fallback: fetch trending movies when user has no watch history.
 * @returns {Promise<Object[]>}
 */
async function fetchTrending() {
  const res = await axios.get(`${TMDB_BASE}/trending/movie/week`, {
    params: { api_key: process.env.TMDB_API_KEY },
    timeout: 8000,
  });
  return res.data.results || [];
}

export { fetchCandidatesFromTMDB, fetchTrending };