import { SIMILAR_MEDIA_FIXTURE } from "../fixtures/movie-detail.fixture";
import { MediaType, USE_FIXTURES } from "../movie-details-constants";
import { HorizontalList } from "./HorizontalList";
import { MediaCard } from "./MediaCard";

export async function SimilarMedia({
  id,
  type,
}: {
  id: string;
  type: MediaType;
}) {
  const similar = USE_FIXTURES
    ? SIMILAR_MEDIA_FIXTURE
    : await fetch(`https://api.themoviedb.org/3/${type}/${id}/similar`, {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`,
        },
      }).then((res) => res.json());

  return (
    <HorizontalList title="More Like This">
      {similar.results.slice(0, 10).map((media: any) => (
        <MediaCard
          key={media.id}
          id={media.id}
          posterPath={media.poster_path}
          rating={media.rating}
          title={media.title}
          type={type}
        />
      ))}
    </HorizontalList>
  );
}
