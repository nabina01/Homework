let movies = [
  { id: 1, title: "The Matrix", genre: "Sci-Fi", year: 1999, rating: 8.7, duration: 136, director: "Wachowski" },
  { id: 2, title: "Inception", genre: "Sci-Fi", year: 2010, rating: 8.8, duration: 148, director: "Nolan" },
  { id: 3, title: "The Godfather", genre: "Crime", year: 1972, rating: 9.2, duration: 175, director: "Coppola" },
  { id: 4, title: "Pulp Fiction", genre: "Crime", year: 1994, rating: 8.9, duration: 154, director: "Tarantino" },
  { id: 5, title: "Forrest Gump", genre: "Drama", year: 1994, rating: 8.8, duration: 142, director: "Zemeckis" },
  { id: 6, title: "The Dark Knight", genre: "Action", year: 2008, rating: 9.0, duration: 152, director: "Nolan" },
  { id: 7, title: "Schindler's List", genre: "Drama", year: 1993, rating: 8.9, duration: 195, director: "Spielberg" },
];

let userPreferences = {
  favoriteGenres: ["Sci-Fi", "Action"],
  minRating: 8.5,
  maxDuration: 160,
  favoriteDirectors: ["Nolan", "Wachowski"],
};

// Watchlist management state
const watchlist = new Set(movies.map(m => m.id)); // all movies initially to watch
const watched = new Set();

// 1 & 2. Recommendation algorithm with score calculation
function getRecommendations(preferences) {
  return movies
    .filter(m =>
      preferences.favoriteGenres.includes(m.genre) &&
      m.rating >= preferences.minRating &&
      m.duration <= preferences.maxDuration
    )
    .map(m => {
      let baseScore = m.rating * 10;
      let genreBonus = preferences.favoriteGenres.includes(m.genre) ? 20 : 0;
      let directorBonus = preferences.favoriteDirectors.includes(m.director) ? 15 : 0;
      let durationPenalty = m.duration > preferences.maxDuration ? -5 : 0;
      let score = baseScore + genreBonus + directorBonus + durationPenalty;

      // Build reason string dynamically
      let reasons = [];
      if (genreBonus) reasons.push("Favorite genre");
      if (directorBonus) reasons.push("Favorite director");
      if (durationPenalty) reasons.push("Duration penalty");

      return { ...m, score, reason: reasons.join(" + ") || "No bonus" };
    })
    .sort((a, b) => b.score - a.score);
}

// 3. Genre statistics using reduce
function genreStats(movies) {
  return movies.reduce((acc, m) => {
    if (!acc[m.genre]) {
      acc[m.genre] = { count: 0, totalRating: 0, totalDuration: 0 };
    }
    acc[m.genre].count++;
    acc[m.genre].totalRating += m.rating;
    acc[m.genre].totalDuration += m.duration;
    return acc;
  }, {});
}

// 4. Similar movies: same genre and director within 5 years difference
function similarMovies(movie) {
  return movies.filter(m =>
    m.id !== movie.id &&
    m.genre === movie.genre &&
    m.director === movie.director &&
    Math.abs(m.year - movie.year) <= 5
  );
}

// 5. Movie collection manager
const movieManager = {
  addToWatchlist(movie) {
    watchlist.add(movie.id);
    watched.delete(movie.id);
  },
  markAsWatched(movieId) {
    if (watchlist.has(movieId)) {
      watchlist.delete(movieId);
      watched.add(movieId);
    }
  },
  getRecommendations(preferences) {
    return getRecommendations(preferences);
  },
  searchByKeyword(keyword) {
    keyword = keyword.toLowerCase();
    return movies.filter(m => m.title.toLowerCase().includes(keyword));
  }
};

// 6. Nested loops for same director rating comparisons
function directorRatingComparisons() {
  const directors = [...new Set(movies.map(m => m.director))];
  let comparisons = {};

  for (let d of directors) {
    let dirMovies = movies.filter(m => m.director === d);
    if (dirMovies.length < 2) continue;

    comparisons[d] = [];
    for (let i = 0; i < dirMovies.length; i++) {
      for (let j = i + 1; j < dirMovies.length; j++) {
        let diff = (dirMovies[j].rating - dirMovies[i].rating).toFixed(1);
        comparisons[d].push({
          movie1: dirMovies[i].title,
          rating1: dirMovies[i].rating,
          movie2: dirMovies[j].title,
          rating2: dirMovies[j].rating,
          improvement: diff,
        });
      }
    }
  }
  return comparisons;
}

// 7. Generate report with ASCII charts
function generateReport(preferences) {
  console.log("Movie Recommendation System");
  console.log("===========================");
  console.log("Based on your preferences:");
  console.log(`✓ Favorite Genres: ${preferences.favoriteGenres.join(", ")}`);
  console.log(`✓ Minimum Rating: ${preferences.minRating}`);
  console.log(`✓ Maximum Duration: ${preferences.maxDuration} minutes`);
  console.log(`✓ Favorite Directors: ${preferences.favoriteDirectors.join(", ")}`);

  const recommendations = movieManager.getRecommendations(preferences);
  console.log("Top Recommendations:");
  recommendations.forEach((m, i) => {
    console.log(`${i + 1}. ${m.title} (${m.year}) - Score: ${Math.round(m.score)}`);
    console.log(` Genre: ${m.genre} | Rating: ${m.rating} | Duration: ${m.duration} min | Director: ${m.director}`);
    console.log(` Reason: ${m.reason}`);
  });

  console.log("\nGenre Statistics:");
  console.log("================");
  const stats = genreStats(movies);
  for (const genre in stats) {
    let s = stats[genre];
    let avgRating = (s.totalRating / s.count).toFixed(2);
    console.log(`${genre}: ${s.count} movie${s.count > 1 ? "s" : ""}, Avg Rating: ${avgRating}, Total Duration: ${s.totalDuration} min`);
  }

  console.log("\nDirector Analysis:");
  console.log("==================");
  const dirComparisons = directorRatingComparisons();
  for (const dir in dirComparisons) {
    const dirMovies = movies.filter(m => m.director === dir);
    const avgRating = (dirMovies.reduce((a, b) => a + b.rating, 0) / dirMovies.length).toFixed(1);
    console.log(`${dir}: ${dirMovies.length} movie${dirMovies.length > 1 ? "s" : ""}, Avg Rating: ${avgRating}`);
    dirComparisons[dir].forEach(c => {
      console.log(`- ${c.movie1} (${c.rating1}) vs ${c.movie2} (${c.rating2}) - Improvement: ${c.improvement > 0 ? "+" : ""}${c.improvement}`);
    });
  }

  console.log("\nRating Distribution:");
  console.log("====================");
  // Group ratings by ranges (e.g. 9.0-9.2, 8.8-8.9, 8.7-8.7)
  const ratingGroups = {
    "9.0-9.2": 0,
    "8.8-8.9": 0,
    "8.7-8.7": 0,
  };
  movies.forEach(m => {
    if (m.rating >= 9.0 && m.rating <= 9.2) ratingGroups["9.0-9.2"]++;
    else if (m.rating >= 8.8 && m.rating <= 8.9) ratingGroups["8.8-8.9"]++;
    else if (m.rating === 8.7) ratingGroups["8.7-8.7"]++;
  });

  for (const range in ratingGroups) {
    const count = ratingGroups[range];
    const bar = "█".repeat(count * 2); // each movie = 2 bars
    console.log(`${range}: ${bar} (${count} movie${count > 1 ? "s" : ""})`);
  }

  console.log("\nWatchlist Management:");
  console.log("=====================");
  console.log(`- Movies to Watch: ${watchlist.size}`);
  console.log(`- Movies Watched: ${watched.size}`);
  // Estimated watch time in hours (sum durations of unwatched movies)
  const totalDuration = movies
    .filter(m => watchlist.has(m.id))
    .reduce((sum, m) => sum + m.duration, 0);
  const estimatedHours = (totalDuration / 60).toFixed(1);
  console.log(`- Estimated Watch Time: ${estimatedHours} hours`);
}

// Run the report
generateReport(userPreferences);
