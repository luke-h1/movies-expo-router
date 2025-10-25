"use client";

import * as AC from "@bacons/apple-colors";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";

interface CreditCardProps {
  credit: {
    id: number;
    media_type: "movie" | "person" | "tv";
    poster_path?: string;
    title?: string;
    name?: string;
    character?: string;
    job?: string;
  };
  index: number;
}

export function CreditCard({ credit, index }: CreditCardProps) {
  return (
    <Link
      key={credit.id + index}
      href={`/${credit.media_type}/${credit.id}`}
      asChild
    >
      <Pressable style={{ width: "48%", marginBottom: 16 }}>
        <View
          style={{
            backgroundColor: AC.secondarySystemBackground,
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          <Image
            transition={200}
            source={{
              uri: credit.poster_path
                ? `https://image.tmdb.org/t/p/w300${credit.poster_path}`
                : undefined,
            }}
            style={{
              borderRadius: 12,
              width: "100%",
              height: 200,
              backgroundColor: AC.systemGray5,
            }}
          />
          <View style={{ padding: 8 }}>
            <Text
              numberOfLines={2}
              style={{
                fontSize: 14,
                fontWeight: "500",
                color: AC.label,
              }}
            >
              {credit.title || credit.name}
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: AC.secondaryLabel,
              }}
            >
              {credit.character || credit.job}
            </Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}
