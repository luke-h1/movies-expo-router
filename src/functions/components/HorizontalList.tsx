import * as AC from "@bacons/apple-colors";
import { ReactNode } from "react";
import { ScrollView, Text, View } from "react-native";

interface Props {
  title: string;
  children: ReactNode;
}

export function HorizontalList({ children, title }: Props) {
  return (
    <View style={{ marginBottom: 24 }}>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "600",
          color: AC.label,
          marginBottom: 12,
          paddingHorizontal: 16,
        }}
      >
        {title}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 12,
        }}
      >
        {children}
      </ScrollView>
    </View>
  );
}
