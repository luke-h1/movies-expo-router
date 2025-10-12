import { ScrollView, View } from "react-native";

export function ListSkeleton() {
  return (
    <View
      style={{
        marginBottom: 24,
      }}
    >
      <View
        style={{
          height: 24,
          width: 200,
          backgroundColor: "rgba(120,120,128,0.12)",
          marginBottom: 12,
          marginHorizontal: 16,
        }}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 12,
        }}
      >
        {[1, 2, 3, 4].map((i) => (
          <View
            key={i}
            style={{
              width: 140,
              height: 210,
              backgroundColor: "rgba(120,120,128,0.12)",
              marginHorizontal: 4,
              borderRadius: 8,
            }}
          />
        ))}
      </ScrollView>
    </View>
  );
}
