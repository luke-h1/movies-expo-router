/// <reference types="react/canary" />
import { Suspense } from "react";
import {
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { renderTrendingMedia } from "../functions/render-search";
import { BodyScrollView } from "./ui/BodyScrollView";

interface SkeletonRowProps {
  numCards: number;
  cardWidth: number;
  cardHeight: number;
  gap: number;
}

const numItems = process.env.EXPO_OS === "web" ? 9 : 6;

function SkeletonRow({
  numCards,
  cardWidth,
  cardHeight,
  gap,
}: SkeletonRowProps) {
  return (
    <View style={styles.container}>
      <View style={styles.skeletonContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[...Array(numCards)].map((_, i) => (
            <View
              key={i}
              style={{
                width: cardWidth,
                marginRight: gap,
              }}
            >
              <View
                key={i}
                style={{
                  width: cardWidth,
                  marginRight: gap,
                }}
              >
                <View
                  style={{
                    width: cardWidth,
                    height: cardHeight,
                    backgroundColor: "rgba(120, 120, 128, 0.12)",
                    borderRadius: 8,
                    marginBottom: 8,
                  }}
                />
                <View
                  style={{
                    width: "100%",
                    height: 16,
                    backgroundColor: "rgba(120, 120, 128, 0.12)",
                    borderRadius: 4,
                    marginBottom: 4,
                  }}
                />
                <View
                  style={{
                    width: "30%",
                    height: 14,
                    backgroundColor: "rgba(120, 120, 128, 0.12)",
                    borderRadius: 4,
                  }}
                />
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

export function SearchPlaceholder() {
  const { width } = useWindowDimensions();
  const cardWidth = 140;
  const cardHeight = 210;
  const gap = 8;
  const numCards = Math.floor((width * 2) / (cardWidth + gap));

  return (
    <BodyScrollView contentContainerStyle={{ paddingVertical: 16, gap: 24 }}>
      <Suspense
        fallback={
          <SkeletonRow
            cardHeight={cardHeight}
            cardWidth={cardWidth}
            gap={gap}
            numCards={numCards}
          />
        }
      >
        {renderTrendingMedia({
          type: "media",
          timeWindow: "day",
          size: numItems,
        })}
      </Suspense>
    </BodyScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  skeletonContainer: {
    width: 200,
    height: 24,
    backgroundColor: "rgba(120, 120, 128, 0.12)",
    borderRadius: 4,
    marginBottom: 12,
  },
});
