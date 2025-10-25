"use client";

import * as AC from "@bacons/apple-colors";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";

const POSTER_WIDTH = 140;
const POSTER_HEIGHT = 210;

interface PersonCardProps {
  id: number;
  name: string;
  department: string;
  profilePath: string | null;
}

export function PersonCard({
  id,
  name,
  department,
  profilePath,
}: PersonCardProps) {
  return (
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
                source={{
                  uri: `https://image.tmdb.org/t/p/w300${profilePath}`,
                }}
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
}
