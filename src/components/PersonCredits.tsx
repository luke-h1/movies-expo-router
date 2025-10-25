"use client";

import * as AC from "@bacons/apple-colors";
import { Pressable, ScrollView, Text, View } from "react-native";
import { CreditCard } from "./CreditCard";

interface PersonCreditsProps {
  allCredits: any[];
  actingCredits: any[];
  directingCredits: any[];
}

export function PersonCredits({
  allCredits,
  actingCredits,
  directingCredits,
}: PersonCreditsProps) {
  return (
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
            <CreditCard key={credit.id + index} credit={credit} index={index} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
