"use server";

import * as AC from "@bacons/apple-colors";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { MediaCard } from "../components/MediaCard";
import { PersonCard } from "../components/PersonCard";
import { TRENDING_MEDIA_FIXTURE } from "./fixtures/search.fixture";

const USE_FIXTURES = false;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export async function renderSearchContents(query: string) {
  return (
    <View style={{ gap: 24 }}>
      <MoviesSection query={query} />
      <ShowsSection query={query} />
      <PeopleSection query={query} />
    </View>
  );
}

async function MoviesSection({ query }: { query: string }) {
  const movies = await getMovies(query);
  if (!movies.length) return null;

  return (
    <View>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "600",
          color: AC.label,
          marginBottom: 12,
          paddingHorizontal: 16,
        }}
      >
        Movies
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 12 }}
      >
        {movies.map((movie: any) => (
          <MediaCard key={movie.id} media={movie} type="movie" />
        ))}
      </ScrollView>
    </View>
  );
}

const ShowsSection = async ({ query }: { query: string }) => {
  const shows = await getShows(query);
  if (!shows.length) return null;

  return (
    <View>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "600",
          color: AC.label,
          marginBottom: 12,
          paddingHorizontal: 16,
        }}
      >
        TV Shows
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 12 }}
      >
        {shows.map((show: any) => (
          <MediaCard key={show.id} media={show} type="tv" />
        ))}
      </ScrollView>
    </View>
  );
};

const PeopleSection = async ({ query }: { query: string }) => {
  const people = await getPeople(query);
  if (!people.length) return null;

  return (
    <View>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "600",
          color: AC.label,
          marginBottom: 12,
          paddingHorizontal: 16,
        }}
      >
        People
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 12 }}
      >
        {people.map((person: any) => (
          <PersonCard
            key={person.id}
            id={person.id}
            name={person.name}
            department={person.known_for_department}
            profilePath={person.profile_path}
          />
        ))}
      </ScrollView>
    </View>
  );
};

async function getMovies(query = "") {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.error("Failed to fetch movies:", response.statusText);
      return [];
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Error fetching movies:", error);
    return [];
  }
}

async function getShows(query = "") {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/tv?query=${encodeURIComponent(query)}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.error("Failed to fetch TV shows:", response.statusText);
      return [];
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Error fetching TV shows:", error);
    return [];
  }
}

async function getPeople(query = "") {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/person?query=${encodeURIComponent(query)}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.error("Failed to fetch people:", response.statusText);
      return [];
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Error fetching people:", error);
    return [];
  }
}

export async function renderTrendingMedia({
  type,
  timeWindow,
  size,
}: {
  type: "all" | "movie" | "tv" | "person";
  timeWindow: "day" | "week";
  size: number;
}) {
  if (USE_FIXTURES) {
    const shows = TRENDING_MEDIA_FIXTURE.results?.slice(0, size) ?? [];
    const title =
      type === "tv"
        ? "TV Shows"
        : type === "movie"
        ? "Movies"
        : type === "person"
        ? "People"
        : "Media";
    return <TrendingSection title={title} items={shows} />;
  }

  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/trending/${type}/${timeWindow}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.error("Failed to fetch trending media:", response.statusText);
      return null;
    }

    const data = await response.json();
    const shows = data.results?.slice(0, size) ?? [];

    const title =
      type === "tv"
        ? "TV Shows"
        : type === "movie"
        ? "Movies"
        : type === "person"
        ? "People"
        : "Media";

    return <TrendingSection title={title} items={shows} />;
  } catch (error) {
    console.error("Error fetching trending media:", error);
    return null;
  }
}

function TrendingSection({ title, items }: { title: string; items: any[] }) {
  return (
    <>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
          paddingHorizontal: 16,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "600",
            color: AC.label,
          }}
        >
          Trending {title}
        </Text>
        {/* <Link href={`/trending/${title.toLowerCase()}`} asChild>
        <Pressable>
          <Text style={{ 
            fontSize: 16,
            color: AC.systemBlue
          }}>
            See All
          </Text>
        </Pressable>
      </Link> */}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 12 }}
      >
        {items.map((item) => (
          <MediaCard
            key={item.id}
            media={item}
            type={title === "Movies" ? "movie" : "tv"}
          />
        ))}
      </ScrollView>
    </>
  );
}
