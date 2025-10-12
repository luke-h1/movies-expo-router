import { MovieSkeleton } from "@/src/components/MovieSkeleton";
import { ShowPageBody } from "@/src/components/ShowHeaderBackground";
import { renderMedia } from "@/src/functions/render-movie-details";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { Suspense } from "react";

export { ErrorBoundary } from "expo-router";

export default function TVShow() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const showId = Array.isArray(id) ? id[0] : id;

  return (
    <ShowPageBody>
      <Stack.Screen options={{ title: "TV Show" }} />
      <Suspense fallback={<MovieSkeleton />}>
        {renderMedia(showId, "tv")}
      </Suspense>
    </ShowPageBody>
  );
}
