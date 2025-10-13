"use client";

import { label } from "@bacons/apple-colors";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";

type MediaType = "movie" | "tv";

export function MediaCard({ media, type }: { media: any; type: MediaType }) {
  return (
    <Link href={`/${type}/${media.id}`} asChild>
      <Pressable style={{ marginHorizontal: 4 }}>
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
      </Pressable>
    </Link>
  );
}
