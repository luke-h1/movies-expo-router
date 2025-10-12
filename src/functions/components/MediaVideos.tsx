import { VideoCard } from "@/src/components/VideoCard";
import { VIDEOS_FIXTURE } from "../fixtures/movie-detail.fixture";
import { MediaType, USE_FIXTURES } from "../movie-details-constants";
import { HorizontalList } from "./HorizontalList";

interface Props {
  id: string;
  type: MediaType;
}

export async function MediaVideos({ id, type }: Props) {
  const videos = USE_FIXTURES
    ? VIDEOS_FIXTURE
    : await fetch(`https://api.themoviedb.org/3/${type}/${id}/videos`, {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`,
        },
      }).then((res) => res.json());

  if (!videos.results.length) {
    return null;
  }

  return (
    <HorizontalList title="Teasers & Trailers">
      {/* @ts-ignore */}
      {videos.results.map((video) => (
        <VideoCard videoKey={video.key} name={video.name} key={video.key} />
      ))}
    </HorizontalList>
  );
}
