import { movieService } from "@/src/services/movieService";
import * as AC from "@bacons/apple-colors";
import { ScrollView, Text, View } from "react-native";
import { PersonCard } from "./PersonCard";

interface Props {
  query: string;
}

export async function PeopleSection({ query }: Props) {
  const people = await movieService.getPeople(query);

  if (people.length === 0) {
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
        People
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 12 }}
      >
        {people.map((person) => (
          <PersonCard
            key={person.id}
            department={person.known_for_department}
            id={person.id}
            name={person.name}
            profilePath={person.profile_path}
          />
        ))}
      </ScrollView>
    </View>
  );
}
