import { TMDB } from "tmdb-ts";

const tmdb = new TMDB(process.env.TMDB_READ_ACCESS_TOKEN!);

export const tmdbService = {
  async getMovieDetails(id: string) {
    try {
      return await tmdb.movies.details(parseInt(id));
    } catch (error: any) {
      // Check if it's a 404 error (resource not found)
      if (error?.status_code === 34 || error?.message?.includes("not found")) {
        return null;
      }
    }
  },

  async getMovieVideos(id: string) {
    try {
      return await tmdb.movies.videos(parseInt(id));
    } catch (error) {
      return { results: [] };
    }
  },

  async getMovieCredits(id: string) {
    try {
      return await tmdb.movies.credits(parseInt(id));
    } catch (error) {
      console.error(`Failed to fetch movie credits ${id}:`, error);
      return { cast: [], crew: [] };
    }
  },

  async getSimilarMovies(id: string) {
    try {
      return await tmdb.movies.similar(parseInt(id));
    } catch (error) {
      return { results: [] };
    }
  },

  async getTVDetails(id: string) {
    try {
      return await tmdb.tvShows.details(parseInt(id));
    } catch (error: any) {
      // Check if it's a 404 error (resource not found)
      if (error?.status_code === 34 || error?.message?.includes("not found")) {
        return null;
      }
      throw error;
    }
  },

  async getTVVideos(id: string) {
    try {
      return await tmdb.tvShows.videos(parseInt(id));
    } catch (error) {
      return { results: [] };
    }
  },

  async getTVCredits(id: string) {
    try {
      return await tmdb.tvShows.credits(parseInt(id));
    } catch (error) {
      return { cast: [], crew: [] };
    }
  },

  async getSimilarTV(id: string) {
    try {
      return await tmdb.tvShows.similar(parseInt(id));
    } catch (error) {
      return { results: [] };
    }
  },

  async getPersonDetails(id: string) {
    try {
      return await tmdb.people.details(parseInt(id));
    } catch (error: any) {
      // Check if it's a 404 error (resource not found)
      if (error?.status_code === 34 || error?.message?.includes("not found")) {
        return [];
      }
    }
  },

  async getPersonCredits(id: string) {
    try {
      return await tmdb.people.combinedCredits(parseInt(id));
    } catch (error) {
      return { cast: [], crew: [] };
    }
  },

  async searchMovies(query: string) {
    try {
      const result = await tmdb.search.movies({ query });
      return result.results || [];
    } catch (error) {
      return [];
    }
  },

  async searchTV(query: string) {
    try {
      const result = await tmdb.search.tvShows({ query });
      return result.results || [];
    } catch (error) {
      return [];
    }
  },

  async searchPeople(query: string) {
    try {
      const result = await tmdb.search.people({ query });
      return result.results || [];
    } catch (error) {
      return [];
    }
  },

  async getTrendingMovies(timeWindow: "day" | "week" = "week") {
    try {
      const result = await tmdb.trending.trending("movie", timeWindow);
      return result.results || [];
    } catch (error) {
      return [];
    }
  },

  async getTrendingTV(timeWindow: "day" | "week" = "week") {
    try {
      const result = await tmdb.trending.trending("tv", timeWindow);
      return result.results || [];
    } catch (error) {
      return [];
    }
  },

  async getTrendingAll(timeWindow: "day" | "week" = "week") {
    try {
      const result = await tmdb.trending.trending("all", timeWindow);
      return result.results || [];
    } catch (error) {
      return [];
    }
  },
};
