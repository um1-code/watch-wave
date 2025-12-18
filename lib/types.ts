export interface Movie {
  backdrop_path: any;
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  overview: string;
  status?: 'want-to-watch' | 'watched';
  userRating?: number;
  notes?: string;
}

export interface AuthState {
  user: any | null;
  token: string | null;
  loading: boolean;
}