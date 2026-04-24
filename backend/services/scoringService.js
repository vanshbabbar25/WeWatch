/**
 * scoringService.js
 * -----------------
 * Pure functions — no DB, no HTTP.
 * All scoring math lives here so it is easy to unit-test in isolation.
 *
 * Composite formula:
 *   score = (GenreScore × 0.5) + (DescSimilarity × 0.3) + (RatingScore × 0.2)
 */

// ─── STOPWORDS ────────────────────────────────────────────────────────────────

const STOPWORDS = new Set([
  "a","an","the","and","or","but","in","on","at","to","for","of","with",
  "is","was","are","were","be","been","has","have","had","that","this",
  "it","its","as","by","from","not","no","he","she","they","their","his",
  "her","we","you","i","me","my","our","your","will","can","do","did",
  "who","what","when","where","how","which","all","just","also","more",
  "about","after","before","up","out","so","if","than","then","into",
  "its","been","there","here","get","got","let","put","set","over",
]);

// ─── TEXT HELPERS ─────────────────────────────────────────────────────────────

/**
 * Tokenize a string into meaningful lowercase words.
 * Returns [] for null/undefined/empty input.
 */
function tokenize(text) {
  if (!text || typeof text !== "string") return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));
}

/**
 * Term-frequency map (normalized by document length).
 */
function buildTF(tokens) {
  const tf = {};
  for (const t of tokens) tf[t] = (tf[t] || 0) + 1;
  const total = tokens.length || 1;
  for (const t in tf) tf[t] /= total;
  return tf;
}

/**
 * Inverse-document-frequency map from a corpus (array of token arrays).
 * Uses +1 smoothing to avoid division by zero.
 */
function buildIDF(corpus) {
  const N = corpus.length;
  const df = {};
  for (const tokens of corpus) {
    for (const t of new Set(tokens)) df[t] = (df[t] || 0) + 1;
  }
  const idf = {};
  for (const t in df) {
    idf[t] = Math.log((N + 1) / (df[t] + 1)) + 1;
  }
  return idf;
}

/**
 * TF-IDF sparse vector for a token list given an IDF map.
 */
function tfidfVector(tokens, idf) {
  const tf = buildTF(tokens);
  const vec = {};
  for (const t in tf) vec[t] = tf[t] * (idf[t] || 1);
  return vec;
}

/**
 * Cosine similarity between two sparse TF-IDF vectors.
 * Returns 0 if either vector is empty.
 */
function cosineSimilarity(vecA, vecB) {
  let dot = 0, normA = 0, normB = 0;
  for (const t in vecA) {
    dot += (vecA[t] || 0) * (vecB[t] || 0);
    normA += vecA[t] ** 2;
  }
  for (const t in vecB) normB += vecB[t] ** 2;
  if (!normA || !normB) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

// ─── GENRE HELPERS ────────────────────────────────────────────────────────────

/**
 * Build a frequency map of genre IDs from a list of watched movies.
 * { 28: 3, 12: 2, 878: 1 }
 */
function buildGenreProfile(watchedMovies) {
  const freq = {};
  for (const movie of watchedMovies) {
    for (const gid of movie.genre_ids || []) {
      freq[gid] = (freq[gid] || 0) + 1;
    }
  }
  return freq;
}

/**
 * Return the top N genre IDs sorted by frequency descending.
 */
function topGenres(genreFreq, topN = 2) {
  return Object.entries(genreFreq)
    .sort(([, a], [, b]) => b - a)
    .slice(0, topN)
    .map(([id]) => Number(id));
}

/**
 * Genre score for a candidate, normalized to [0, 1].
 */
function computeGenreScore(candidateGenreIds, genreFreq) {
  const maxPossible = Object.values(genreFreq).reduce((s, v) => s + v, 0);
  if (!maxPossible) return 0;
  let score = 0;
  for (const gid of candidateGenreIds || []) {
    if (genreFreq[gid]) score += genreFreq[gid];
  }
  return Math.min(score / maxPossible, 1);
}

// ─── MAIN SCORER ─────────────────────────────────────────────────────────────

/**
 * Score a list of candidate movies against the user's watched movies.
 *
 * @param {Object[]} watchedMovies  - Up to 3 watched movie objects
 * @param {Object[]} candidates     - Raw TMDB movie objects to score
 * @returns {Object[]}              - Candidates enriched with `score` + `scoreBreakdown`
 */
function scoreCandidates(watchedMovies, candidates) {
  const genreFreq = buildGenreProfile(watchedMovies);

  // Build TF-IDF corpus: [combined watched text, ...each candidate]
  const watchedTokens = tokenize(
    watchedMovies.map((m) => m.overview || "").join(" ")
  );
  const candidateTokensList = candidates.map((c) => tokenize(c.overview || ""));
  const corpus = [watchedTokens, ...candidateTokensList];
  const idf = buildIDF(corpus);
  const watchedVec = tfidfVector(watchedTokens, idf);

  return candidates.map((movie, idx) => {
    const genreScore = computeGenreScore(movie.genre_ids, genreFreq);

    const candidateVec = tfidfVector(candidateTokensList[idx], idf);
    const descSimilarity = cosineSimilarity(watchedVec, candidateVec);

    const ratingScore = (movie.vote_average || 0) / 10;

    const score = genreScore * 0.5 + descSimilarity * 0.3 + ratingScore * 0.2;

    return {
      tmdbId: movie.id,
      title: movie.title,
      genre_ids: movie.genre_ids || [],
      overview: movie.overview || "",
      vote_average: movie.vote_average || 0,
      poster_path: movie.poster_path || "",
      release_date: movie.release_date || "",
      score: parseFloat(score.toFixed(4)),
      scoreBreakdown: {
        genreScore: parseFloat(genreScore.toFixed(4)),
        descSimilarity: parseFloat(descSimilarity.toFixed(4)),
        ratingScore: parseFloat(ratingScore.toFixed(4)),
      },
    };
  });
}

export {
  buildGenreProfile,
  topGenres,
  scoreCandidates,
  // exposed for unit testing
  tokenize,
  cosineSimilarity,
};