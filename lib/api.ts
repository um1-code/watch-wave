import axios from 'axios';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = process.env.NEXT_PUBLIC_TMDB_KEY || "97ca10f5cde769f2a4954342ecad7b02";

const tmdb = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: API_KEY, // This attaches the key to every URL
    language: 'en-US',
  },
});

export const fetchMovies = {
  getTrending: async () => {
    const { data } = await tmdb.get('/trending/movie/week');
    return data.results;
  },
  getTopRated: async () => {
    const { data } = await tmdb.get('/movie/top_rated');
    return data.results;
  },
  getAction: async () => {
    const { data } = await tmdb.get('/discover/movie', {
      params: { with_genres: 28 }
    });
    return data.results;
  },
  getOriginals: async () => {
    const { data } = await tmdb.get('/discover/tv', {
      params: { with_networks: 213 } // Netflix Network ID
    });
    return data.results;
  }
};