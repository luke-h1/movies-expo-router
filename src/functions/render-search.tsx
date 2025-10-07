"use server";

import { View } from "react-native";
import { MoviesSection } from "./components/MoviesSection";
import { PeopleSection } from "./components/PeopleSection";
import { ShowsSection } from "./components/ShowsSection";
import { TrendingSection } from "./components/TrendingSection";
import { TRENDING_MEDIA_FIXTURE } from "./fixtures/search.fixture";

export const POSTER_WIDTH = 140;
export const POSTER_HEIGHT = 210;
const USE_FIXTURES = false;

interface RenderTrendingMediaArgs {
  type: "movie" | "tv" | "media";
  timeWindow: "day" | "week";
  size: number;
}

export async function renderSearchContents(query: string) {
  return (
    <View style={{ gap: 24 }}>
      <MoviesSection query={query} />
      <ShowsSection query={query} />
      <PeopleSection query={query} />
    </View>
  );
}

export async function renderTrendingMedia({
  size,
  timeWindow,
  type,
}: RenderTrendingMediaArgs) {
  const data = USE_FIXTURES
    ? TRENDING_MEDIA_FIXTURE
    : await fetch(`https://api.moviedb.org/3/trending/${type}/${timeWindow}`, {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`,
        },
      }).then((res) => res.json());

  const shows = data.results.slice(0, size);

  return (
    <TrendingSection
      title={type === "tv" ? "TV Shows" : "Movies"}
      items={shows}
    />
  );
}
