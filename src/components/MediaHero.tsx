import * as AC from "@bacons/apple-colors";
import { Image } from "expo-image";
import { Text, View } from "react-native";
import { MediaType } from "../functions/movie-details-constants";
import { ParallaxImageWrapper } from "./ParallaxImageWrapper";

interface MediaHeroProps {
  media: {
    backdrop_path: string;
    poster_path: string;
    name?: string;
    title?: string;
    tagline: string;
  };
  type: MediaType;
}

export function MediaHero({ media, type }: MediaHeroProps) {
  return (
    <View>
      <View>
        <ParallaxImageWrapper>
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
        </ParallaxImageWrapper>
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
              uri: `https:/image.tmdb.org/t/p/w500${media.poster_path}`,
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
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                color: AC.label,
                marginBottom: 8,
              }}
            >
              {type === "movie" ? media.title : media.name}
            </Text>
            <Text style={{ fontSize: 15, color: AC.label, opacity: 0.8 }}>
              {media.tagline}
            </Text>
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
