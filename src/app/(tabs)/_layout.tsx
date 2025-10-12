import { IconSymbol } from "@/src/components/ui/IconSymbol";
import Tabs from "@/src/components/ui/Tabs";
import { useColorScheme } from "@/src/hooks/useColorScheme";
import { Stack, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";

const SettingsButton = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  return (
    <TouchableOpacity
      onPress={() => router.push("/settings")}
      style={{ marginLeft: 16 }}
    >
      <IconSymbol
        name="gearshape.fill"
        size={24}
        color={colorScheme === "dark" ? "#fff" : "#000"}
      />
    </TouchableOpacity>
  );
};

export default function TabLayout() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Tabs
        initialRouteName="movies"
        screenOptions={{
          headerShown: true,
          headerLeft: () => <SettingsButton />,
        }}
      >
        <Tabs.Screen
          name="search"
          title="Search"
          systemImage="magnifyingglass"
          options={{
            href: "/(tabs)/search",
          }}
        />
        <Tabs.Screen
          name="movies"
          title="Movies"
          systemImage="film"
          options={{
            href: "/(tabs)/movies",
          }}
        />
        <Tabs.Screen
          name="tv"
          title="TV"
          systemImage="tv"
          options={{
            href: "/(tabs)/tv",
          }}
        />
        <Tabs.Screen
          name="ai"
          title="AI"
          systemImage="0.circle"
          options={{ href: "/(tabs)/ai" }}
        />
      </Tabs>
    </>
  );
}
