"use client";

import * as AC from "@bacons/apple-colors";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { IconSymbol } from "./ui/IconSymbol";

interface MediaNotFoundProps {
  type: "movie" | "tv" | "person";
  id: string;
}

export function MediaNotFound({ type, id }: MediaNotFoundProps) {
  const typeLabel = type === "tv" ? "TV Show" : type;
  const capitalizedType =
    typeLabel.charAt(0).toUpperCase() + typeLabel.slice(1);

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 32,
        gap: 16,
      }}
    >
      <View
        style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: AC.systemGray5,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 8,
        }}
      >
        <IconSymbol
          name="exclamationmark.triangle"
          size={40}
          color={AC.systemGray}
        />
      </View>

      <Text
        style={{
          fontSize: 24,
          fontWeight: "600",
          color: AC.label,
          textAlign: "center",
        }}
      >
        {capitalizedType} with ID: {id} Not Found
      </Text>

      <Text
        style={{
          fontSize: 16,
          color: AC.secondaryLabel,
          textAlign: "center",
          lineHeight: 22,
        }}
      >
        We couldn&lsquo;t find the {typeLabel} you&apos;re looking for. It may
        have been removed or is no longer available.
      </Text>

      <Pressable
        onPress={() => {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.replace("/");
          }
        }}
        style={({ pressed }) => ({
          backgroundColor: AC.systemBlue,
          paddingHorizontal: 24,
          paddingVertical: 12,
          borderRadius: 12,
          marginTop: 16,
          opacity: pressed ? 0.7 : 1,
        })}
      >
        <Text
          style={{
            color: "white",
            fontSize: 16,
            fontWeight: "600",
          }}
        >
          Go Back
        </Text>
      </Pressable>
    </View>
  );
}
