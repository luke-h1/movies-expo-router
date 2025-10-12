"use server";

import * as AC from "@bacons/apple-colors";
import { Image } from "expo-image";
import { Link } from "expo-router";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { FadeIn } from "../components/ui/FadeIn";
import TouchableBounce from "../components/ui/TouchableBounce";
import { tmdbService } from "../services/tmdbService";
import { TRENDING_MEDIA_FIXTURE } from "./fixtures/search.fixture";

const POSTER_WIDTH = 140;
const POSTER_HEIGHT = 210;
const USE_FIXTURES = false;

export async function renderSearchContents(query: string) {
  return (
    <View style={{ gap: 24 }}>
      <MoviesSection query={query} />
      <ShowsSection query={query} />
      <PeopleSection query={query} />
    </View>
  );
}

const MediaCard = ({
  id,
  title,
  rating,
  posterPath,
  type,
}: {
  id: number;
  title: string;
  rating: number;
  posterPath: string | null;
  type: "movie" | "tv" | "person";
}) => (
  <Link href={`/${type}/${id}`} asChild>
    <TouchableBounce style={{ marginHorizontal: 4 }}>
      <View
        style={{
          width: POSTER_WIDTH,

          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            width: POSTER_WIDTH,
            height: POSTER_HEIGHT,
            backgroundColor: AC.systemGray5,
            borderRadius: 12,
          }}
        >
          {posterPath && (
            <Image
              source={{ uri: `https://image.tmdb.org/t/p/w300${posterPath}` }}
              style={{ borderRadius: 12, width: "100%", height: "100%" }}
              transition={200}
            />
          )}
        </View>
        <View style={{ padding: 8 }}>
          <Text
            numberOfLines={2}
            style={{
              fontSize: 14,
              fontWeight: "500",
              color: AC.label,
              marginBottom: 4,
            }}
          >
            {title}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: AC.systemBlue,
            }}
          >
            ★ {rating.toFixed(1)}
          </Text>
        </View>
      </View>
    </TouchableBounce>
  </Link>
);

const PersonCard = ({
  id,
  name,
  department,
  profilePath,
}: {
  id: number;
  name: string;
  department: string;
  profilePath: string | null;
}) => (
  <Link href={`/person/${id}`} asChild>
    <TouchableBounce style={{ marginHorizontal: 4 }}>
      <View
        style={{
          width: POSTER_WIDTH,
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            width: POSTER_WIDTH,
            height: POSTER_HEIGHT,
            backgroundColor: AC.systemGray5,
            borderRadius: 12,
          }}
        >
          {profilePath && (
            <Image
              source={{ uri: `https://image.tmdb.org/t/p/w300${profilePath}` }}
              style={{ borderRadius: 12, width: "100%", height: "100%" }}
              transition={200}
            />
          )}
        </View>
        <View style={{ padding: 8 }}>
          <Text
            numberOfLines={2}
            style={{
              fontSize: 14,
              fontWeight: "500",
              color: AC.label,
              marginBottom: 4,
            }}
          >
            {name}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: AC.secondaryLabel,
            }}
          >
            {department}
          </Text>
        </View>
      </View>
    </TouchableBounce>
  </Link>
);

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
          <MediaCard
            key={movie.id}
            id={movie.id}
            title={movie.title}
            rating={movie.vote_average}
            posterPath={movie.poster_path}
            type="movie"
          />
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
          <MediaCard
            key={show.id}
            id={show.id}
            title={show.name}
            rating={show.vote_average}
            posterPath={show.poster_path}
            type="tv"
          />
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
  return await tmdbService.searchMovies(query);
}

async function getShows(query = "") {
  return await tmdbService.searchTV(query);
}

async function getPeople(query = "") {
  return await tmdbService.searchPeople(query);
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
  const data = USE_FIXTURES
    ? TRENDING_MEDIA_FIXTURE
    : type === "movie"
    ? { results: await tmdbService.getTrendingMovies(timeWindow) }
    : type === "tv"
    ? { results: await tmdbService.getTrendingTV(timeWindow) }
    : { results: await tmdbService.getTrendingAll(timeWindow) };

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
}

function TrendingSection({ title, items }: { title: string; items: any[] }) {
  return (
    <FadeIn>
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
          <TouchableBounce>
            <Text style={{ 
              fontSize: 16,
              color: AC.systemBlue
            }}>
              See All
            </Text>
          </TouchableBounce>
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
              id={item.id}
              title={item.title || item.name}
              rating={item.vote_average}
              posterPath={item.poster_path}
              type={title === "Movies" ? "movie" : "tv"}
            />
          ))}
        </ScrollView>
      </>
    </FadeIn>
  );
}
