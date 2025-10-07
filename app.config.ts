import { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "lho-movies-expo-router",
  slug: "lho-movies-expo-router",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "lhomoviesexporouter",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    bundleIdentifier: "com.lukehowsam123.lhomoviesexporouter",
    supportsTablet: true,
    infoPlist: {
      UIViewControllerBasedStatusBarAppearance: true,
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  android: {
    package: "com.lukehowsam123.lhomoviesexporouter",
    adaptiveIcon: {
      backgroundColor: "#E6F4FE",
      foregroundImage: "./assets/images/android-icon-foreground.png",
      backgroundImage: "./assets/images/android-icon-background.png",
      monochromeImage: "./assets/images/android-icon-monochrome.png",
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
  },
  web: {
    output: "server",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-font",
    "expo-web-browser",
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
        dark: {
          backgroundColor: "#000000",
        },
      },
    ],
  ],
  experiments: {
    reactServerFunctions: true,
    typedRoutes: true,
    reactCompiler: true,
  },
});
