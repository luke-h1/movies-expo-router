"use client";

import * as AC from "@bacons/apple-colors";
import { Image } from "expo-image";
import { Text, View } from "react-native";

interface VideoCardProps {
  videoKey: string;
  name: string;
}

export function VideoCard({ videoKey, name }: VideoCardProps) {
  return (
    <View style={{ width: 280, marginHorizontal: 4 }}>
      <Image
        source={{
          uri: `https://img.youtube.com/vi/${videoKey}/0.jpg`,
        }}
        style={{
          width: "100%",
          height: 157,
          borderRadius: 8,
        }}
        transition={300}
      />
      <Text style={{ fontSize: 14, color: AC.label, marginTop: 4 }}>
        {name}
      </Text>
    </View>
  );
}
