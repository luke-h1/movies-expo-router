"use client";

import * as AC from "@bacons/apple-colors";
import { Image } from "expo-image";
import { Link } from "expo-router";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { MediaCard } from "../MediaCard";
import { FadeIn } from "../ui/FadeIn";

const POSTER_WIDTH = 140;
const POSTER_HEIGHT = 210;

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
    <Pressable style={{ marginHorizontal: 4 }}>
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
    </Pressable>
  </Link>
);

export function MoviesClient({ movies }: { movies: any[] }) {
  return (
    <View style={{ gap: 12 }}>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "600",
          color: AC.label,
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

export function ShowsClient({ shows }: { shows: any[] }) {
  return (
    <View style={{ gap: 12 }}>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "600",
          color: AC.label,
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
}

export function PeopleClient({ people }: { people: any[] }) {
  return (
    <View style={{ gap: 12 }}>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "600",
          color: AC.label,
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
}

export function TrendingSectionClient({
  title,
  items,
}: {
  title: string;
  items: any[];
}) {
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
    </FadeIn>
  );
}
