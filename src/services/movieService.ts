const API_BASE_URL = "https://api.themoviedb.org";

export const movieService = {
  getCombinedCredits: async (id: string) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/3/person/${id}/combined_credits`,
        {
          headers: {
            Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch combined credits");
      }

      const data = await res.json();
      return data;
    } catch (e) {
      console.error("Error fetching combined credits", e);
      return [];
    }
  },
  getPerson: async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/3/person/${id}`, {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch combined credits");
      }

      const data = await res.json();
      return data;
    } catch (e) {
      console.error(`Error fetching person with ID ${id}`, e);
      return [];
    }
  },
  getPeople: async (
    query = ""
  ): Promise<
    {
      id: number;
      name: string;
      known_for_department: string;
      profile_path: string;
    }[]
  > => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/3/search/person?query=${encodeURIComponent(query)}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch people");
      }

      const data = await res.json();
      return data.results;
    } catch (e) {
      console.error("Error fetching people:", e);
      return [];
    }
  },
  getShows: async (
    query = ""
  ): Promise<
    {
      id: string;
      name: string;
      vote_average: number;
      poster_path: string;
    }[]
  > => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/3/search/tv?query=${encodeURIComponent(query)}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch shows");
      }

      const data = await res.json();
      return data.results;
    } catch (e) {
      console.error("error fetching shows", e);
      return [];
    }
  },
  getMovies: async (
    query = ""
  ): Promise<
    {
      id: string;
      title: string;
      vote_average: number;
      poster_path: string;
    }[]
  > => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/3/search/movie?query=${encodeURIComponent(query)}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to movies");
      }

      const data = await res.json();

      return data.results;
    } catch (e) {
      console.error("Error fetching movies", e);
      return [];
    }
  },
};
