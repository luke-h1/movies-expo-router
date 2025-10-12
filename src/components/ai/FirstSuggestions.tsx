"use client";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { tw } from "@/src/utils/tw";
import * as AC from "@bacons/apple-colors";
import { PromptOnTap } from "./PromptOnTap";

export function FirstSuggestions() {
  return (
    <View
      style={{
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 8,
        paddingHorizontal: 16,
      }}
    >
      {(["Trending movies this week"].filter(Boolean) as string[]).map(
        (title, index) => (
          <Animated.View
            entering={FadeInDown.delay((3 - index) * 100)}
            key={String(index)}
          >
            <PromptOnTap
              key={String(index)}
              style={{}}
              activeOpacity={0.7}
              prompt={title}
            >
              <View
                style={[
                  styles.suggestion,
                  tw`transition-colors hover:bg-systemGray4`,
                ]}
              >
                <Text
                  style={{
                    color: AC.label,
                    fontSize: 16,
                  }}
                >
                  {title}
                </Text>
              </View>
            </PromptOnTap>
          </Animated.View>
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  suggestion: {
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    borderCurve: "continuous",
    padding: 8,
    borderColor: AC.systemGray5,
    backgroundColor: AC.secondarySystemGroupedBackground,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
  },
});
