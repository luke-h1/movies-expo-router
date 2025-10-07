import { movieService } from "@/src/services/movieService";
import * as AC from "@bacons/apple-colors";
import { ScrollView, Text, View } from "react-native";
import { MediaCard } from "./MediaCard";

interface Props {
  query: string;
}

export async function MoviesSection({ query }: Props) {
  const movies = await movieService.getMovies(query);

  if (movies.length === 0) {
    return null;
  }

  return (
    <View>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "600",
          color: AC.label,
          marginBottom: 12,
          paddingHorizontal: 16,
        }}
      >
        Movies
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 12 }}
      >
        {movies.map((movie) => (
          <MediaCard
            key={movie.id}
            title={movie.title}
            rating={movie.vote_average}
            id={movie.id}
            posterPath={movie.poster_path}
            type="movie"
          />
        ))}
      </ScrollView>
    </View>
  );
}
