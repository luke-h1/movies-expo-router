import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { ReanimatedScreenProvider } from "react-native-screens/reanimated";
import Tabs from "../components/ui/Tabs";
import ThemeProvider from "../components/ui/ThemeProvider";

export { ErrorBoundary } from "expo-router";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <ReanimatedScreenProvider>
        <Tabs>
          <Tabs.Screen
            name="(index)"
            title="search"
            systemImage="magnifyingglass"
          />
          <Tabs.Screen
            name="(settings)"
            title="Expo router movies"
            systemImage="app.gift.fill"
          />
        </Tabs>
      </ReanimatedScreenProvider>
      {process.env.EXPO_OS === "android" && <StatusBar style="auto" />}
    </ThemeProvider>
  );
}
