import { movieService } from "@/src/services/movieService";
import * as AC from "@bacons/apple-colors";
import { ScrollView, Text, View } from "react-native";
import { MediaCard } from "./MediaCard";

interface ShowsSectionProps {
  query: string;
}

export async function ShowsSection({ query }: ShowsSectionProps) {
  const shows = await movieService.getShows(query);

  if (shows.length === 0) {
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
        TV Shows
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 12,
        }}
      >
        {shows.map((show) => (
          <MediaCard
            id={show.id}
            posterPath={show.poster_path}
            rating={show.vote_average}
            title={show.name}
            type="show"
            key={show.id}
          />
        ))}
      </ScrollView>
    </View>
  );
}
