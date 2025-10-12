import { MediaHero } from "@/src/components/MediaHero";
import { FadeIn } from "@/src/components/ui/FadeIn";
import * as AC from "@bacons/apple-colors";
import { Stack } from "expo-router";
import { Text, View } from "react-native";
import { MEDIA_FIXTURE } from "../fixtures/movie-detail.fixture";
import { MediaType, USE_FIXTURES } from "../movie-details-constants";

export async function MediaDetails({
  id,
  type,
}: {
  id: string;
  type: MediaType;
}) {
  const media = USE_FIXTURES
    ? MEDIA_FIXTURE
    : await fetch(`https://api.themoviedb.org/3/${type}/${id}`, {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`,
        },
      }).then((res) => res.json());

  return (
    <>
      <Stack.Screen
        options={{
          title: type === "movie" ? media.title : media.name,
        }}
      />

      <FadeIn>
        <MediaHero media={media} type={type} />
      </FadeIn>

      <FadeIn>
        <View
          style={{
            backgroundColor: AC.systemGroupedBackground,
            paddingBottom: 24,
            paddingHorizontal: 16,
          }}
        >
          <Text style={{ fontSize: 16, color: AC.label, lineHeight: 24 }}>
            {media.overview}
          </Text>
        </View>
      </FadeIn>

      <FadeIn>
        <View
          style={{
            paddingBottom: 24,
            paddingHorizontal: 16,
            backgroundColor: AC.systemGroupedBackground,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "600",
              color: AC.label,
              marginBottom: 12,
            }}
          >
            About
          </Text>
          <View
            style={{
              backgroundColor: "rgba(120, 120, 128, 0.12)",
              borderRadius: 10,
            }}
          >
            {[
              {
                label: type === "movie" ? "Release Date" : "First Air Date",
                value: new Date(
                  type === "movie" ? media.release_date : media.first_air_date
                ).toLocaleDateString(),
              },
              {
                label: "Age Rating",
                value: media.adult ? "Adult" : "All Ages",
              },
              {
                label: type === "movie" ? "Runtime" : "Episode Runtime",
                value:
                  type === "movie"
                    ? `${media.runtime} minutes`
                    : `${media.episode_run_time?.[0] || "N/A"} minutes`,
              },
              {
                label: "Budget",
                value: media.budget
                  ? `$${(media.budget / 1000000).toFixed(1)}M`
                  : "N/A",
              },
              {
                label: "Revenue",
                value: media.revenue
                  ? `$${(media.revenue / 1000000).toFixed(1)}M`
                  : "N/A",
              },
              {
                label: "Countries",
                value: media.production_countries
                  .map((c: { name: string }) => c.name)
                  .join(", "),
              },
              {
                label: "Languages",
                value: media.spoken_languages
                  .map((l: { name: string }) => l.name)
                  .join(", "),
              },
              {
                label: "Genres",
                value: media.genres
                  .map((g: { name: string }) => g.name)
                  .join(", "),
              },
            ].map((item, index, array) => (
              <View
                key={item.label}
                style={{
                  padding: 12,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  borderBottomWidth: index === array.length - 1 ? 0 : 0.5,
                  borderBottomColor: "rgba(120,120,128,0.2)",
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: AC.label,
                    opacity: 0.8,
                    flex: 1,
                  }}
                >
                  {item.label}
                </Text>
                <Text style={{ fontSize: 16, color: AC.label, flex: 2 }}>
                  {item.value}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </FadeIn>
    </>
  );
}
