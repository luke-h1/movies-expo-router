import { CompanyCard } from "@/src/components/CompanyCard";
import { MEDIA_COMPANIES_FIXTURE } from "../fixtures/movie-detail.fixture";
import { MediaType, USE_FIXTURES } from "../movie-details-constants";
import { HorizontalList } from "./HorizontalList";

interface Props {
  id: string;
  type: MediaType;
}

export async function MediaCompanies({ id, type }: Props) {
  const media = USE_FIXTURES
    ? MEDIA_COMPANIES_FIXTURE
    : await fetch(`https://api.themoviedb.org/3/${type}/${id}`, {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`,
        },
      }).then((res) => res.json());

  return (
    <HorizontalList title="Companies">
      {/* @ts-ignore */}
      {media.production_companies.map((c) => (
        <CompanyCard key={c.id} logo_path={c.logo_path} name={c.name} />
      ))}
    </HorizontalList>
  );
}
