"use server";

import * as AC from "@bacons/apple-colors";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { MediaNotFound } from "../components/MediaNotFound";
import { ParallaxImageWrapper } from "../components/ParallaxImageWrapper";
import ShowMore from "../components/ShowMore";
import Stack from "../components/ui/Stack";
import { tmdbService } from "../services/tmdbService";

export async function renderPersonDetails(id: string) {
  const [person, credits] = await Promise.all([
    tmdbService.getPersonDetails(id),
    tmdbService.getPersonCredits(id),
  ]);

  if (!person) {
    return <MediaNotFound type="person" id={id} />;
  }

  /**
   * process credits into categories
   */
  // @ts-ignore
  const allCredits = [...(credits.cast || []), ...(credits.crew || [])];
  // @ts-ignore
  const actingCredits = credits.cast || [];
  // @ts-ignore
  const crewCredits = credits.crew || [];
  // @ts-ignore
  const directingCredits = crewCredits.filter(
    (credit: any) => credit.job === "Director"
  );

  return (
    <View style={{ flex: 1 }}>
      {/* @ts-ignore */}
      <Stack.Screen options={{ title: person.name }} />
      {/* hero section */}
      <View
        style={{
          height: 300,
          backgroundColor: AC.systemGray6,
          justifyContent: "flex-end",
          padding: 16,
        }}
      >
        {/* @ts-ignore */}
        {person.profile_path && (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          >
            <ParallaxImageWrapper>
              <Image
                transition={200}
                source={{
                  // @ts-expect-error
                  uri: `https://image.tmdb.org/t/p/original${person.profile_path}`,
                }}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                }}
              />
            </ParallaxImageWrapper>
            {/* @ts-ignore */}
            <View
              style={{
                // subtle transparent to black gradient at the bottom of the image
                [process.env.EXPO_OS === "web"
                  ? `backgroundImage`
                  : `experimental_backgroundImage`]: `linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,0.8))`,

                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: 100,
              }}
            />
          </View>
        )}
        <Text
          style={{
            fontSize: 18,
            color: "rgba(209, 209, 214, 1)",
          }}
        >
          {/* @ts-ignore */}
          {person.known_for_department}
        </Text>
      </View>
      {/* overview section */}
      <View style={{ padding: 16, backgroundColor: AC.systemBackground }}>
        <Text
          style={{
            fontSize: 22,
            fontWeight: "600",
            color: AC.label,
            marginBottom: 12,
          }}
        >
          Overview
        </Text>
        <View
          style={{
            backgroundColor: AC.secondarySystemGroupedBackground,
            borderRadius: 10,
            marginBottom: 16,
          }}
        >
          {[
            // @ts-ignore
            person.birthday && {
              label: "Born",
              // @ts-ignore
              value: `${new Date(person.birthday).toLocaleDateString()}${
                // @ts-ignore
                person.place_of_birth ? ` in ${person.place_of_birth}` : ""
              }`,
            },
            // @ts-ignore
            person.deathday && {
              label: "Died",
              // @ts-ignore
              value: new Date(person.deathday).toLocaleDateString(),
            },
          ]
            .filter((item): item is { label: string; value: string } =>
              Boolean(item)
            )
            .map((item, index, array) => (
              <View
                key={item.label + index}
                style={{
                  padding: 12,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  borderBottomWidth: index === array.length - 1 ? 0 : 0.5,
                  borderBottomColor: "rgba(120,120,128,0.2)",
                }}
              >
                <Text
                  style={{ fontSize: 16, color: AC.secondaryLabel, flex: 1 }}
                >
                  {item.label}
                </Text>
                <Text
                  numberOfLines={1}
                  style={{ fontSize: 16, color: AC.label, flex: 2 }}
                >
                  {item.value}
                </Text>
              </View>
            ))}
        </View>
        <View>
          {/* @ts-ignore */}
          <ShowMore text={person.biography} />
        </View>
      </View>
      {/* credits */}
      <View style={{ flex: 1, marginTop: 16 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{
            paddingHorizontal: 16,
          }}
        >
          <Pressable style={{ marginRight: 16 }}>
            <Text style={{ color: AC.systemBlue }}>
              All ({allCredits.length})
            </Text>
          </Pressable>
          <Pressable style={{ marginRight: 16 }}>
            <Text style={{ color: AC.label }}>
              Acting ({actingCredits.length})
            </Text>
          </Pressable>
          <Pressable>
            <Text style={{ color: AC.label }}>
              Directing ({directingCredits.length})
            </Text>
          </Pressable>
        </ScrollView>

        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            {allCredits.map((credit: any, index: number) => (
              <Link
                key={credit.id + index}
                // @ts-ignore
                href={`/${credit.media_type as "movie" | "person" | "tv"}/${
                  credit.id
                }`}
                asChild
              >
                <Pressable style={{ width: "48%", marginBottom: 16 }}>
                  <View
                    style={{
                      backgroundColor: AC.secondarySystemBackground,
                      borderRadius: 12,
                      overflow: "hidden",
                    }}
                  >
                    <Image
                      transition={200}
                      source={{
                        // @ts-ignore
                        uri: credit.poster_path
                          ? `https://image.tmdb.org/t/p/w300${credit.poster_path}`
                          : undefined,
                      }}
                      style={{
                        borderRadius: 12,
                        width: "100%",
                        height: 200,
                        backgroundColor: AC.systemGray5,
                      }}
                    />
                    <View style={{ padding: 8 }}>
                      <Text
                        numberOfLines={2}
                        style={{
                          fontSize: 14,
                          fontWeight: "500",
                          color: AC.label,
                        }}
                      >
                        {/* @ts-ignore */}
                        {credit.title || credit.name}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: AC.secondaryLabel,
                        }}
                      >
                        {/* @ts-ignore */}
                        {credit.character || credit.job}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              </Link>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
