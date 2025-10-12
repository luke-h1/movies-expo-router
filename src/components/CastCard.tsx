"use client";

import * as AC from "@bacons/apple-colors";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { Pressable, Text } from "react-native";

interface CastCardProps {
  person: {
    id: string;
    profile_path: string;
    name: string;
    character: string;
  };
}

export function CastCard({ person }: CastCardProps) {
  return (
    <Link href={`/person/${person.id}`} asChild push>
      <Pressable style={{ width: 100, marginHorizontal: 4 }}>
        <Image
          source={{
            uri: person.profile_path
              ? `https://image.tmdb.org/t/p/w200${person.profile_path}`
              : `https://via.placeholder.com/100x150`,
          }}
          transition={300}
          style={{
            width: 100,
            height: 150,
            borderRadius: 8,
          }}
        />
        <Text
          style={{
            fontSize: 14,
            color: AC.label,
            marginTop: 4,
          }}
          numberOfLines={1}
        >
          {person.name}
        </Text>
        <Text
          style={{
            fontSize: 12,
            color: AC.label,
            opacity: 0.7,
          }}
          numberOfLines={1}
        >
          {person.character}
        </Text>
      </Pressable>
    </Link>
  );
}
