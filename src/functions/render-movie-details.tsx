"use server";

import * as AC from "@bacons/apple-colors";
import { label } from "@bacons/apple-colors";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { CastCard } from "../components/CastCard";
import { CompanyCard } from "../components/CompanyCard";
import { MediaCard } from "../components/MediaCard";
import { MediaHero } from "../components/MediaHero";
import { MediaNotFound } from "../components/MediaNotFound";
import { VideoCard } from "../components/VideoCard";
import {
  CREDITS_FIXTURE,
  MEDIA_COMPANIES_FIXTURE,
  MEDIA_FIXTURE,
  SIMILAR_MEDIA_FIXTURE,
  VIDEOS_FIXTURE,
} from "./fixtures/movie-detail.fixture";

const USE_FIXTURES = false;

type MediaType = "movie" | "tv";

async function tmdbFetch(endpoint: string) {
  const response = await fetch(`https://api.themoviedb.org/3${endpoint}`, {
    headers: {
      Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error(`TMDB API error: ${response.statusText}`);
  }

  return response.json();
}

export async function renderMedia(id: string, type: MediaType = "movie") {
  return (
    <>
      <MediaDetails id={id} type={type} />

      <React.Suspense fallback={<ListSkeleton />}>
        <MediaVideos id={id} type={type} />
      </React.Suspense>

      <React.Suspense fallback={<ListSkeleton />}>
        <MediaCast id={id} type={type} />
      </React.Suspense>

      <React.Suspense fallback={<ListSkeleton />}>
        <MediaCompanies id={id} type={type} />
      </React.Suspense>

      <React.Suspense fallback={<ListSkeleton />}>
        <SimilarMedia id={id} type={type} />
      </React.Suspense>
    </>
  );
}

function HorizontalList({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={{ marginBottom: 24 }}>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "600",
          color: label,
          marginBottom: 12,
          paddingHorizontal: 16,
        }}
      >
        {title}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 12 }}
      >
        {children}
      </ScrollView>
    </View>
  );
}

async function MediaDetails({ id, type }: { id: string; type: MediaType }) {
  if (!id) {
    throw new Error(`Invalid ${type} ID`);
  }

  const media = USE_FIXTURES
    ? MEDIA_FIXTURE
    : type === "movie"
    ? await tmdbFetch(`/movie/${id}`)
    : await tmdbFetch(`/tv/${id}`);

  // If media is not found, show error message
  if (!media) {
    return <MediaNotFound type={type} id={id} />;
  }

  return (
    <>
      <MediaHero media={media} type={type} />

      <View
        style={{
          backgroundColor: AC.systemGroupedBackground,
          paddingBottom: 24,
          paddingHorizontal: 16,
        }}
      >
        <Text style={{ fontSize: 16, color: label, lineHeight: 24 }}>
          {media.overview || "No overview available."}
        </Text>
      </View>

      <View
        style={{
          paddingBottom: 24,
          paddingHorizontal: 16,
          backgroundColor: AC.systemGroupedBackground,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "600",
            color: label,
            marginBottom: 12,
          }}
        >
          About
        </Text>
        <View
          style={{
            backgroundColor: "rgba(120,120,128,0.12)",
            borderRadius: 10,
          }}
        >
          {[
            {
              label: type === "movie" ? "Release Date" : "First Air Date",
              value: (
                type === "movie"
                  ? "release_date" in media
                    ? // @ts-ignore
                      media.release_date
                    : "first_air_date" in media
                    ? // @ts-ignore
                      media.first_air_date
                    : ""
                  : "first_air_date" in media
                  ? // @ts-ignore
                    media.first_air_date
                  : ""
              )
                ? new Date(
                    type === "movie"
                      ? // @ts-ignore
                        media.release_date
                      : // @ts-ignore
                        media.first_air_date
                  ).toLocaleDateString()
                : "N/A",
            },
            {
              label: "Age Rating",
              // @ts-ignore
              value: media.adult ? "Adult" : "All Ages",
            },
            {
              label: type === "movie" ? "Runtime" : "Episode Runtime",
              value:
                type === "movie"
                  ? // @ts-ignore
                    media.runtime
                    ? // @ts-ignore
                      `${media.runtime} minutes`
                    : "N/A"
                  : // @ts-ignore
                  media.episode_run_time?.[0]
                  ? // @ts-ignore
                    `${media.episode_run_time[0]} minutes`
                  : "N/A",
            },
            ...(type === "movie"
              ? [
                  {
                    label: "Budget",
                    // @ts-ignore
                    value: media.budget
                      ? // @ts-ignore
                        `$${(media.budget / 1000000).toFixed(1)}M`
                      : "N/A",
                  },
                  {
                    label: "Revenue",
                    // @ts-ignore
                    value: media.revenue
                      ? // @ts-ignore
                        `$${(media.revenue / 1000000).toFixed(1)}M`
                      : "N/A",
                  },
                ]
              : []),
            {
              label: "Countries",
              value:
                media.production_countries
                  ?.map((c: { name: string }) => c.name)
                  .join(", ") || "N/A",
            },
            {
              label: "Languages",
              value:
                media.spoken_languages
                  ?.map((l: { name: string }) => l.name)
                  .join(", ") || "N/A",
            },
            {
              label: "Genres",
              value:
                media.genres?.map((g: { name: string }) => g.name).join(", ") ||
                "N/A",
            },
          ].map((item, index, array) => (
            <View
              key={item.label}
              style={{
                padding: 12,
                flexDirection: "row",
                justifyContent: "space-between",
                borderBottomWidth: index === array.length - 1 ? 0 : 0.5,
                borderBottomColor: "rgba(120,120,128,0.2)",
              }}
            >
              <Text
                style={{ fontSize: 16, color: label, opacity: 0.8, flex: 1 }}
              >
                {item.label}
              </Text>
              <Text style={{ fontSize: 16, color: label, flex: 2 }}>
                {item.value}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </>
  );
}

async function MediaVideos({ id, type }: { id: string; type: MediaType }) {
  const videos = USE_FIXTURES
    ? VIDEOS_FIXTURE
    : type === "movie"
    ? await tmdbFetch(`/movie/${id}/videos`).catch(() => ({ results: [] }))
    : await tmdbFetch(`/tv/${id}/videos`).catch(() => ({ results: [] }));

  if (!videos?.results || videos.results.length === 0) return null;

  return (
    <HorizontalList title="Teasers & Trailers">
      {videos.results.map((video: any) => (
        <VideoCard key={video.key} videoKey={video.key} name={video.name} />
      ))}
    </HorizontalList>
  );
}

async function MediaCast({ id, type }: { id: string; type: MediaType }) {
  const credits = USE_FIXTURES
    ? CREDITS_FIXTURE
    : type === "movie"
    ? await tmdbFetch(`/movie/${id}/credits`).catch(() => ({
        cast: [],
        crew: [],
      }))
    : await tmdbFetch(`/tv/${id}/credits`).catch(() => ({
        cast: [],
        crew: [],
      }));

  if (!credits.cast || credits.cast.length === 0) {
    return null;
  }

  return (
    <HorizontalList title="Cast & Crew">
      {credits.cast.slice(0, 10).map((person: any) => (
        <CastCard key={person.id} person={person} />
      ))}
    </HorizontalList>
  );
}

async function MediaCompanies({ id, type }: { id: string; type: MediaType }) {
  const media = USE_FIXTURES
    ? MEDIA_COMPANIES_FIXTURE
    : type === "movie"
    ? await tmdbFetch(`/movie/${id}`)
    : await tmdbFetch(`/tv/${id}`);

  if (
    !media ||
    !media.production_companies ||
    media.production_companies.length === 0
  ) {
    return <MediaNotFound type="movie" id={id} />;
  }

  return (
    <HorizontalList title="Companies">
      {media.production_companies.map((company: any) => (
        <CompanyCard
          key={company.id}
          logo_path={company.logo_path}
          name={company.name}
        />
      ))}
    </HorizontalList>
  );
}

async function SimilarMedia({ id, type }: { id: string; type: MediaType }) {
  const similar = USE_FIXTURES
    ? SIMILAR_MEDIA_FIXTURE
    : type === "movie"
    ? await tmdbFetch(`/movie/${id}/similar`).catch(() => ({ results: [] }))
    : await tmdbFetch(`/tv/${id}/similar`).catch(() => ({ results: [] }));

  if (!similar.results || similar.results.length === 0) {
    return null;
  }

  return (
    <HorizontalList title="More Like This">
      {similar.results.slice(0, 10).map((media: any) => (
        <MediaCard key={media.id} media={media} type={type} />
      ))}
    </HorizontalList>
  );
}

function ListSkeleton() {
  return (
    <View style={{ marginBottom: 24 }}>
      <View
        style={{
          height: 24,
          width: 200,
          backgroundColor: "rgba(120,120,128,0.12)",
          marginBottom: 12,
          marginHorizontal: 16,
        }}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 12 }}
      >
        {[1, 2, 3, 4].map((i) => (
          <View
            key={i}
            style={{
              width: 140,
              height: 210,
              backgroundColor: "rgba(120,120,128,0.12)",
              marginHorizontal: 4,
              borderRadius: 8,
            }}
          />
        ))}
      </ScrollView>
    </View>
  );
}
