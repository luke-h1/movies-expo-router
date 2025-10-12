/// <reference types="react/canary" />

import { ListSkeleton } from "@/src/components/ListSkeleton";
import { BodyScrollView } from "@/src/components/ui/BodyScrollView";
import { renderTrendingMedia } from "@/src/functions/render-search";
import { Suspense } from "react";
import { View } from "react-native";

export default function MoviesScreen() {
  return (
    <BodyScrollView contentContainerStyle={{ paddingVertical: 16 }}>
      <Suspense fallback={<ListSkeleton />}>
        <View style={{ gap: 24, paddingVertical: 16 }}>
          {renderTrendingMedia({ type: "movie", timeWindow: "week", size: 20 })}
        </View>
      </Suspense>
    </BodyScrollView>
  );
}
