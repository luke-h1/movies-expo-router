import { CastCard } from "@/src/components/CastCard";
import { CREDITS_FIXTURE } from "../fixtures/movie-detail.fixture";
import { MediaType, USE_FIXTURES } from "../movie-details-constants";
import { HorizontalList } from "./HorizontalList";

interface Props {
  id: string;
  type: MediaType;
}

export async function MediaCast({ id, type }: Props) {
  const credits = USE_FIXTURES
    ? CREDITS_FIXTURE
    : await fetch(`https://api.themoviedb.org/3/${type}/${id}/credits`, {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`,
        },
      }).then((res) => res.json());

  return (
    <HorizontalList title="Cast & Crew">
      {/* @ts-ignore */}
      {credits.cast.slice(0, 10).map((p) => (
        <CastCard key={p.id} person={p} />
      ))}
    </HorizontalList>
  );
}
