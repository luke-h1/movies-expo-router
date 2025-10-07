import { FadeIn } from "@/src/components/ui/FadeIn";
import * as AC from "@bacons/apple-colors";
import { ScrollView, Text, View } from "react-native";
import { MediaCard } from "./MediaCard";

type TrendingSectionProps = {
  title: string;
  items: {
    id: string;
    title: string;
    name: string;
    vote_average: string;
    poster_path: string;
    type: string;
  }[];
};

export function TrendingSection({ items, title }: TrendingSectionProps) {
  return (
    <FadeIn>
      <>
        <View
          style={{
            flexDirection: "row",
            alignContent: "center",
            justifyContent: "space-between",
            marginBottom: 12,
            paddingHorizontal: 16,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "600",
              color: AC.label,
            }}
          >
            Trending {title}
          </Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 12,
          }}
        >
          {items &&
            items.map((item) => (
              <MediaCard
                key={item.id}
                id={item.id}
                title={item.title || item.name}
                rating={parseInt(item.vote_average, 10)}
                posterPath={item.poster_path}
                type={title === "Movies" ? "movie" : "show"}
              />
            ))}
        </ScrollView>
      </>
    </FadeIn>
  );
}
