"use server";

import * as AC from "@bacons/apple-colors";
import { Text, View } from "react-native";
import { MediaNotFound } from "../components/MediaNotFound";
import { PersonCredits } from "../components/PersonCredits";
import { PersonHero } from "../components/PersonHero";
import ShowMore from "../components/ShowMore";

export async function renderPersonDetails(id: string) {
  const TMDB_API_KEY = process.env.TMDB_READ_ACCESS_TOKEN!;

  const [person, credits] = await Promise.all([
    // Fetch person details
    fetch(`https://api.themoviedb.org/3/person/${id}`, {
      headers: {
        Authorization: `Bearer ${TMDB_API_KEY}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 404) return null;
          throw new Error(`Failed to fetch person details: ${res.statusText}`);
        }
        return res.json();
      })
      .catch((error) => {
        console.error(`Failed to fetch person details ${id}:`, error);
        return null;
      }),
    // Fetch person credits
    fetch(`https://api.themoviedb.org/3/person/${id}/combined_credits`, {
      headers: {
        Authorization: `Bearer ${TMDB_API_KEY}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch person credits: ${res.statusText}`);
        }
        return res.json();
      })
      .catch((error) => {
        console.error(`Failed to fetch person credits ${id}:`, error);
        return { cast: [], crew: [] };
      }),
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
      <PersonHero person={person} />
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
      <PersonCredits
        allCredits={allCredits}
        actingCredits={actingCredits}
        directingCredits={directingCredits}
      />
    </View>
  );
}
