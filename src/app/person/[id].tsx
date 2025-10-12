import { MovieSkeleton } from "@/src/components/MovieSkeleton";
import { ShowPageBody } from "@/src/components/ShowHeaderBackground";
import { renderPersonDetails } from "@/src/functions/render-person-details";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { Suspense } from "react";

export { ErrorBoundary } from "expo-router";

export default function Person() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <ShowPageBody>
      <Stack.Screen options={{ title: "Person" }} />
      <Suspense fallback={<MovieSkeleton />}>
        {renderPersonDetails(id)}
      </Suspense>
    </ShowPageBody>
  );
}
