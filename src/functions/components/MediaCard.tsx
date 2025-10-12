"use client";

import TouchableBounce from "@/src/components/ui/TouchableBounce";
import * as AC from "@bacons/apple-colors";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { POSTER_HEIGHT, POSTER_WIDTH } from "../constants";

interface MediaCardProps {
  id: string;
  title: string;
  rating: number;
  posterPath: string | null;
  type: "movie" | "tv" | "person";
  layout?: "horizontal" | "vertical";
}

export function MediaCard({
  id,
  posterPath,
  rating,
  title,
  type,
  layout = "vertical",
}: MediaCardProps) {
  const isHorizontal = layout === "horizontal";

  return (
    <Link href={`/${type}/${id}`} asChild>
      <TouchableBounce style={styles.touchable}>
        <View
          style={[styles.container, isHorizontal && styles.containerHorizontal]}
        >
          <View style={styles.imageWrapper}>
            {posterPath && (
              <Image
                source={{ uri: `https://image.tmdb.org/t/p/w300${posterPath}` }}
                style={styles.image}
                transition={200}
              />
            )}
          </View>
          <View
            style={[styles.content, isHorizontal && styles.contentHorizontal]}
          >
            <Text numberOfLines={2} style={styles.title}>
              {title}
            </Text>
            <Text style={styles.rating}> ★ {rating.toFixed(1)}</Text>
          </View>
        </View>
      </TouchableBounce>
    </Link>
  );
}

const styles = StyleSheet.create({
  touchable: {
    marginHorizontal: 4,
  },
  container: {
    width: POSTER_WIDTH,
    borderRadius: 12,
    overflow: "hidden",
  },
  containerHorizontal: {
    flexDirection: "row",
    width: "auto",
    minWidth: 300,
  },
  imageWrapper: {
    width: POSTER_WIDTH,
    height: POSTER_HEIGHT,
    backgroundColor: AC.systemGray5,
    borderRadius: 12,
  },
  image: {
    borderRadius: 12,
    width: "100%",
    height: "100%",
  },
  content: {
    padding: 8,
  },
  contentHorizontal: {
    flex: 1,
    justifyContent: "center",
    paddingLeft: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: "500",
    color: AC.label,
    marginBottom: 4,
  },
  rating: {
    fontSize: 12,
    color: AC.systemBlue,
  },
});
