"use client";

import * as AC from "@bacons/apple-colors";
import { label } from "@bacons/apple-colors";
import { Image } from "expo-image";
import { Text, View } from "react-native";

type MediaType = "movie" | "tv";

export function MediaHero({ media, type }: { media: any; type: MediaType }) {
  return (
    <View>
      <View>
        <View style={{ height: 300, overflow: "hidden" }}>
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
        </View>

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
