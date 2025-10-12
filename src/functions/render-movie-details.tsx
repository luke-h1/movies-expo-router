"use server";

import * as AC from "@bacons/apple-colors";
import { label } from "@bacons/apple-colors";
import { Image } from "expo-image";
import { Link, Stack } from "expo-router";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { CastCard } from "../components/CastCard";
import { CompanyCard } from "../components/CompanyCard";
import { MediaNotFound } from "../components/MediaNotFound";
import { ParallaxImageWrapper } from "../components/ParallaxImageWrapper";
import { VideoCard } from "../components/VideoCard";
import { FadeIn } from "../components/ui/FadeIn";
import TouchableBounce from "../components/ui/TouchableBounce";
import { tmdbService } from "../services/tmdbService";
import {
  CREDITS_FIXTURE,
  MEDIA_COMPANIES_FIXTURE,
  MEDIA_FIXTURE,
  SIMILAR_MEDIA_FIXTURE,
  VIDEOS_FIXTURE,
} from "./fixtures/movie-detail.fixture";

const USE_FIXTURES = false;

type MediaType = "movie" | "tv";

export async function renderMedia(id: string, type: MediaType = "movie") {
  return (
    <>
      <Stack.Screen
        options={{
          title: "",
        }}
      />

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

function MediaHero({ media, type }: { media: any; type: MediaType }) {
  return (
    <View>
      <View>
        <ParallaxImageWrapper>
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500${media.backdrop_path}`,
            }}
            style={{
              width: "100%",
              height: 300,
              resizeMode: "cover",
            }}
            transition={300}
          />
        </ParallaxImageWrapper>

        <View
          style={{
            padding: 16,
            marginTop: -60,
            flexDirection: "row",
          }}
        >
          <View
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              top: 80,

              backgroundColor: AC.systemGroupedBackground,
            }}
          />
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500${media.poster_path}`,
            }}
            style={{
              width: 100,
              height: 150,
              borderRadius: 8,
              marginRight: 16,
            }}
            transition={300}
          />

          <View
            style={{
              flex: 1,
              justifyContent: "flex-end",
            }}
          >
            <View
              style={{
                justifyContent: "flex-end",
              }}
            >
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  color: label,
                  marginBottom: 8,
                }}
              >
                {type === "movie" ? media.title : media.name}
              </Text>
              {media.tagline && (
                <Text style={{ fontSize: 15, color: label, opacity: 0.8 }}>
                  {media.tagline}
                </Text>
              )}
            </View>
          </View>
        </View>
      </View>
      <View
        style={{
          height: 24,
          backgroundColor: AC.systemGroupedBackground,
        }}
      />
    </View>
  );
}

function MediaCard({ media, type }: { media: any; type: MediaType }) {
  return (
    <Link href={`/${type}/${media.id}`} asChild>
      <TouchableBounce style={{ marginHorizontal: 4 }}>
        <View style={{ width: 140 }}>
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w300${media.poster_path}`,
            }}
            style={{ width: 140, height: 210, borderRadius: 8 }}
            transition={300}
          />
          <Text
            style={{ fontSize: 14, color: label, marginTop: 4 }}
            numberOfLines={2}
          >
            {type === "movie" ? media.title : media.name}
          </Text>
          <Text style={{ fontSize: 12, color: label, opacity: 0.7 }}>
            ★ {media.vote_average.toFixed(1)}
          </Text>
        </View>
      </TouchableBounce>
    </Link>
  );
}

async function MediaDetails({ id, type }: { id: string; type: MediaType }) {
  if (!id) {
    throw new Error(`Invalid ${type} ID`);
  }

  const media = USE_FIXTURES
    ? MEDIA_FIXTURE
    : type === "movie"
    ? await tmdbService.getMovieDetails(id)
    : await tmdbService.getTVDetails(id);

  // If media is not found, show error message
  if (!media) {
    return <MediaNotFound type={type} id={id} />;
  }

  return (
    <>
      <Stack.Screen
        options={{
          // @ts-ignore
          title: type === "movie" ? media.title : media.name,
        }}
      />

      <FadeIn>
        <MediaHero media={media} type={type} />
      </FadeIn>

      <FadeIn>
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
      </FadeIn>

      <FadeIn>
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
                  media.genres
                    ?.map((g: { name: string }) => g.name)
                    .join(", ") || "N/A",
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
      </FadeIn>
    </>
  );
}

async function MediaVideos({ id, type }: { id: string; type: MediaType }) {
  const videos = USE_FIXTURES
    ? VIDEOS_FIXTURE
    : type === "movie"
    ? await tmdbService.getMovieVideos(id)
    : await tmdbService.getTVVideos(id);

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
    ? await tmdbService.getMovieCredits(id)
    : await tmdbService.getTVCredits(id);

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
    ? await tmdbService.getMovieDetails(id)
    : await tmdbService.getTVDetails(id);

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
    ? await tmdbService.getSimilarMovies(id)
    : await tmdbService.getSimilarTV(id);

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
