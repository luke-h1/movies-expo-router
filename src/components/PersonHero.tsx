"use client";

import * as AC from "@bacons/apple-colors";
import { Image } from "expo-image";
import { Text, View } from "react-native";

interface PersonHeroProps {
  person: {
    name: string;
    known_for_department: string;
    profile_path?: string;
  };
}

export function PersonHero({ person }: PersonHeroProps) {
  return (
    <View
      style={{
        height: 300,
        backgroundColor: AC.systemGray6,
        justifyContent: "flex-end",
        padding: 16,
      }}
    >
      {person.profile_path && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          <Image
            transition={200}
            source={{
              uri: `https://image.tmdb.org/t/p/original${person.profile_path}`,
            }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />
          <View
            style={{
              // @ts-ignore
              [process.env.EXPO_OS === "web"
                ? `backgroundImage`
                : `experimental_backgroundImage`]: `linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,0.8))`,

              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 100,
            }}
          />
        </View>
      )}
      <Text
        style={{
          fontSize: 32,
          fontWeight: "bold",
          color: "rgba(209, 209, 214, 1)",
          marginBottom: 4,
        }}
      >
        {person.name}
      </Text>
      <Text
        style={{
          fontSize: 18,
          color: "rgba(209, 209, 214, 1)",
        }}
      >
        {person.known_for_department}
      </Text>
    </View>
  );
}
