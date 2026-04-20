const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Proxy endpoint for trending movies
app.get('/api/trending', async (req, res) => {
  try {
    const response = await fetch(`${TMDB_BASE_URL}/trending/movie/week`, {
      headers: {
        Authorization: `Bearer ${TMDB_API_KEY}`
      }
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
});

// Proxy endpoint for movie search
app.get('/api/search', async (req, res) => {
  try {
    const { query } = req.query;
    const response = await fetch(`${TMDB_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`, {
      headers: {
        Authorization: `Bearer ${TMDB_API_KEY}`
      }
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search movies' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
