/// <reference types="react/canary" />

import { ListSkeleton } from "@/src/components/ListSkeleton";
import { SearchPlaceholder } from "@/src/components/SearchPlaceholder";
import { BodyScrollView } from "@/src/components/ui/BodyScrollView";
import { renderSearchContents } from "@/src/functions/render-search";
import { useHeaderSearch } from "@/src/hooks/useHeaderSearch";
import { Suspense } from "react";

export default function SearchScreen() {
  const search = useHeaderSearch({
    placeholder: "Search movies, shows, people...",
    autoCapitalize: "none",
  });

  if (!search.trim()) {
    return <SearchPlaceholder />;
  }

  return (
    <BodyScrollView contentContainerStyle={{ paddingVertical: 16 }}>
      <Suspense fallback={<ListSkeleton />}>
        {renderSearchContents(search)}
      </Suspense>
    </BodyScrollView>
  );
}
