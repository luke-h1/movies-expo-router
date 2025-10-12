import TouchableBounce from "@/src/components/ui/TouchableBounce";
import * as AC from "@bacons/apple-colors";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { Text, View } from "react-native";
import { POSTER_HEIGHT, POSTER_WIDTH } from "../constants";

interface PersonCardProps {
  id: number;
  name: string;
  department: string;
  profilePath: string | null;
}

export const PersonCard = ({
  department,
  id,
  name,
  profilePath,
}: PersonCardProps) => {
  return (
    <Link key={id} href={`/person/${id}`} asChild>
      <TouchableBounce style={{ marginHorizontal: 4 }}>
        <View
          style={{
            width: POSTER_WIDTH,
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              width: POSTER_WIDTH,
              height: POSTER_HEIGHT,
              backgroundColor: AC.systemGray5,
              borderRadius: 12,
            }}
          >
            {profilePath && (
              <Image
                source={{
                  uri: `https://image.tmdb.org/t/p/w300${profilePath}`,
                }}
                style={{
                  borderRadius: 12,
                  width: "100%",
                  height: "100%",
                }}
                transition={200}
              />
            )}
          </View>
          <View style={{ padding: 8 }}>
            <Text
              numberOfLines={2}
              style={{
                fontSize: 14,
                fontWeight: "500",
                color: AC.label,
                marginBottom: 4,
              }}
            >
              {name}
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: AC.secondaryLabel,
              }}
            >
              {department}
            </Text>
          </View>
        </View>
      </TouchableBounce>
    </Link>
  );
};
