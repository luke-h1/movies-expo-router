import { MovieSkeleton } from "@/src/components/MovieSkeleton";
import { ShowPageBody } from "@/src/components/ShowHeaderBackground";
import { renderMedia } from "@/src/functions/render-movie-details";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { Suspense } from "react";

export { ErrorBoundary } from "expo-router";

export default function Movie() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const movieId = Array.isArray(id) ? id[0] : id;

  return (
    <ShowPageBody>
      <Stack.Screen options={{ title: "Movie" }} />
      <Suspense fallback={<MovieSkeleton />}>
        {renderMedia(movieId, "movie")}
      </Suspense>
    </ShowPageBody>
  );
}
