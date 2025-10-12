"use client";

import * as AC from "@bacons/apple-colors";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { Text, View } from "react-native";

interface Props {
  logo_path: string;
  name: string;
}

export function CompanyCard({ logo_path, name }: Props) {
  return (
    <View
      style={{ alignItems: "center", marginHorizontal: 8, gap: 4, width: 100 }}
    >
      <BlurView
        tint="systemChromeMaterial"
        intensity={100}
        style={{
          width: 100,
          height: 100,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        {logo_path && (
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w200${logo_path}`,
            }}
            style={{ width: 80, height: 80, resizeMode: "contain" }}
            transition={300}
          />
        )}
      </BlurView>
      <Text
        style={{
          fontSize: 12,
          color: AC.label,
          marginTop: 4,
          fontWeight: "600",
        }}
        numberOfLines={2}
      >
        {name}
      </Text>
    </View>
  );
}
