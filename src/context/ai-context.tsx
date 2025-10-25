import { createAI, getMutableAIState, streamUI } from "@ai-sdk/rsc";
import type { ModelMessage } from "ai";
import { z } from "zod";

import { openai } from "@ai-sdk/openai";

// Skeleton and display components
import { unstable_headers } from "expo-router/rsc/headers";
import MarkdownText from "../components/MarkdownText";
import { MoviesCard, MoviesSkeleton } from "../components/MovieCard";
import { nanoid } from "../utils/nanoid";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is required");
}

if (!process.env.TMDB_READ_ACCESS_TOKEN) {
  throw new Error("TMDB_READ_ACCESS_TOKEN is required");
}

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

// Helper function to make TMDB API calls
async function tmdbFetch(endpoint: string) {
  const response = await fetch(`${TMDB_BASE_URL}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.statusText}`);
  }

  return response.json();
}

console.log(process.env.TMDB_READ_ACCESS_TOKEN);

export async function onSubmit(message: string) {
  "use server";

  const aiState = getMutableAIState();

  aiState.update({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        id: nanoid(),
        role: "user",
        content: message,
      },
    ],
  });

  const headers = await unstable_headers();

  const result = await streamUI({
    model: openai("gpt-4o-mini"),
    messages: [
      {
        role: "system",
        content: `\
You are a helpful movie and TV show assistant. You ONLY help with movies and TV shows.

IMPORTANT: If a user's message is not clearly about movies or TV shows, you MUST respond ONLY with: "I only respond to TV / movie questions."

Valid movie/TV queries include:
- Searching for specific movies or shows (e.g., "find Inception", "show me Batman movies")
- Asking for trending/popular content (e.g., "what's trending?", "popular movies")
- Asking for recommendations (e.g., "recommend a movie", "what should I watch?")
- Asking about new releases (e.g., "what's new?", "latest movies")
- Questions about actors, directors, genres, ratings, plot details

For valid movie/TV queries:
- For searches: provide a query parameter with the search term
- For trending/popular: leave query empty and use appropriate time_window (week)

Examples of INVALID queries that should get the rejection message:
- "test"
- "hello"
- "what's the weather?"
- "how do I cook pasta?"
- Any question not related to movies or TV shows

Always be friendly and conversational with valid queries. After showing results, offer to help further or suggest related searches.

User info:
- city: ${headers.get("eas-ip-city") ?? (__DEV__ ? "London" : "unknown")}
- country: ${headers.get("eas-ip-country") ?? (__DEV__ ? "GB" : "unknown")}
- region: ${headers.get("eas-ip-region") ?? (__DEV__ ? "GB" : "unknown")}
- device platform: ${headers.get("expo-platform") ?? "unknown"}
`,
      },
      ...aiState
        .get()
        .messages.filter(
          (message: Message) =>
            (message.role === "user" && typeof message.content === "string") ||
            (message.role === "assistant" &&
              typeof message.content === "string")
        )
        .map((message: Message) => ({
          role: message.role,
          content: message.content,
        })),
    ],
    text: ({ content, done }) => {
      if (done) {
        aiState.done({
          ...aiState.get(),
          messages: [
            ...aiState.get().messages,
            {
              id: nanoid(),
              role: "assistant",
              content,
            },
          ],
        });
      }
      return <MarkdownText done={done}>{content}</MarkdownText>;
    },
    tools: {
      get_media: {
        description:
          "Search for movies or TV shows, or get trending/popular content from TMDB. Use this for any movie or TV show related queries including searches, recommendations, trending, popular, or new releases.",
        inputSchema: z.object({
          time_window: z
            .enum(["day", "week"])
            .describe(
              "Time window for trending content (day or week). Use 'day' for recent/today, 'week' for this week."
            )
            .default("day"),
          media_type: z
            .enum(["tv", "movie"])
            .describe(
              "Type of media: 'movie' for films, 'tv' for TV shows/series"
            )
            .default("movie"),
          generated_description: z
            .string()
            .describe(
              "A short, user-friendly description of what content is being fetched (e.g. 'Trending movies today', 'Search results for Inception', 'Popular TV shows this week')"
            ),
          query: z
            .string()
            .describe(
              "The search query string for finding specific movies or TV shows. Only provide this when the user is searching for specific content. Leave empty/undefined for trending or popular content."
            )
            .optional(),
        }),
        async *generate({
          generated_description,
          time_window,
          media_type,
          query,
        }) {
          const toolCallId = nanoid();

          // Update AI state to track tool call
          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: toolCallId,
                role: "assistant",
                content: [
                  {
                    type: "tool-call",
                    toolName: "get_media",
                    toolCallId,
                    args: {
                      generated_description,
                      time_window,
                      media_type,
                      query,
                    },
                  },
                ],
              },
            ],
          });

          // Show loading skeleton immediately
          yield <MoviesSkeleton />;

          let results: any[] = [];

          try {
            if (query) {
              // Search for specific movies or TV shows
              const encodedQuery = encodeURIComponent(query);
              if (media_type === "movie") {
                const data = await tmdbFetch(
                  `/search/movie?query=${encodedQuery}`
                );
                results = data.results || [];
              } else {
                const data = await tmdbFetch(
                  `/search/tv?query=${encodedQuery}`
                );
                results = data.results || [];
              }
              console.log("results ->", results);
            } else {
              // Get trending movies or TV shows
              if (media_type === "movie") {
                const data = await tmdbFetch(`/trending/movie/${time_window}`);
                results = data.results || [];
              } else {
                const data = await tmdbFetch(`/trending/tv/${time_window}`);
                results = data.results || [];
              }
            }

            // Ensure media_type is set on each result
            const movies = results.map((media: any) => {
              if (!media.media_type) {
                media.media_type = media_type;
              }
              return media;
            });

            // Update AI state with tool result
            aiState.done({
              ...aiState.get(),
              messages: [
                ...aiState.get().messages,
                {
                  id: nanoid(),
                  role: "tool",
                  content: [
                    {
                      type: "tool-result",
                      toolName: "get_media",
                      toolCallId,
                      result: {
                        count: movies.length,
                        description: generated_description,
                      },
                    },
                  ],
                },
              ],
            });

            return <MoviesCard data={movies} title={generated_description} />;
          } catch (error) {
            console.error("Failed to fetch media:", error);

            // Update AI state with error
            aiState.done({
              ...aiState.get(),
              messages: [
                ...aiState.get().messages,
                {
                  id: nanoid(),
                  role: "tool",
                  content: [
                    {
                      type: "tool-result",
                      toolName: "get_media",
                      toolCallId,
                      result: { error: String(error) },
                    },
                  ],
                },
              ],
            });

            return <MoviesCard data={[]} title={generated_description} />;
          }
        },
      },
    },
  });

  return {
    id: nanoid(),
    display: result.value,
  };
}

export type Message = ModelMessage & {
  id: string;
};

export type AIState = {
  chatId: string;
  messages: Message[];
};

export type UIState = {
  id: string;
  display: React.ReactNode;
}[];

const actions = {
  onSubmit,
} as const;

export const AI = createAI<AIState, UIState, typeof actions>({
  actions,
  initialUIState: [],
  initialAIState: { chatId: nanoid(), messages: [] },
});
