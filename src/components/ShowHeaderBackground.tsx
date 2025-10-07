"use client";

// directive for react-compiler to not optimize this file
"use no memo";

import { createContext, ReactNode, useEffect } from "react";

import * as AC from "@bacons/apple-colors";
import { BlurView as ExpoBlurView } from "expo-blur";
import { StyleSheet, useColorScheme, ViewStyle } from "react-native";
import Animated, {
  AnimatedRef,
  interpolate,
  interpolateColor,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from "react-native-reanimated";
import { useReanimatedHeaderHeight } from "react-native-screens/reanimated";
import { BodyScrollView } from "./ui/BodyScrollView";
import Stack from "./ui/Stack";

export const ScrollContext =
  createContext<AnimatedRef<Animated.ScrollView> | null>(null);

const BlurView = Animated.createAnimatedComponent(ExpoBlurView);

export const HEADER_HEIGHT = 300;
export const ANIM_START = HEADER_HEIGHT * 0.66;

interface Props {
  children: ReactNode;
}

export function ShowPageBody({ children }: Props) {
  "use no memo";
  const ref = useAnimatedRef<Animated.ScrollView>();

  const scroll = useScrollViewOffset(ref);

  const style =
    process.env.EXPO_OS === "ios"
      ? // eslint-disable-next-line react-hooks/rules-of-hooks
        useAnimatedStyle(() => {
          const inputRange = [ANIM_START, ANIM_START + 30];
          return {
            opacity: interpolate(scroll.get(), inputRange, [0, 1], "clamp"),
            borderBottomColor: interpolateColor(scroll.get(), inputRange, [
              `rgba(84.15, 84.15, 89.25,0)`,
              `rgba(84.15, 84.15, 89.25, 0.5)`,
            ]),
          };
        })
      : // eslint-disable-next-line react-hooks/rules-of-hooks
        useAnimatedStyle(() => {
          return {
            opacity: interpolate(scroll.get(), [100, 150], [0, 1], "clamp"),
            borderBottomColor: `rgba(84.15, 84.15, 89.25, ${interpolate(
              scroll.get(),
              [100, 150],
              [0, 0.2],
              "clamp"
            )})`,
          };
        });

  const titleStyle = useAnimatedStyle(() => {
    const inputRange = [ANIM_START, ANIM_START + 30];
    return {
      opacity: interpolate(scroll.get(), inputRange, [0, 1], "clamp"),
      transform: [
        {
          translateY: interpolate(scroll.get(), inputRange, [5, 0], "clamp"),
        },
      ],
    };
  });

  useEffect(() => {
    ref.current?.scrollTo();
  }, [ref]);

  return (
    <BodyScrollView
      ref={ref}
      automaticallyAdjustContentInsets
      contentInsetAdjustmentBehavior="never"
    >
      <Stack.Screen
        options={{
          headerTransparent: true,
          headerLargeTitle: false,
          headerLargeStyle: {
            backgroundColor: undefined,
          },
          headerBlurEffect: "none",
          headerBackButtonDisplayMode: "minimal",
          headerTintColor: AC.label as unknown as string,
          headerBackground() {
            if (process.env.EXPO_OS === "web") {
              return <AnimatedShowHeaderBackground style={style} />;
            }
            return <AnimatedShowHeaderBackgroundIos style={style} />;
          },
          headerTitle(props) {
            return (
              <Animated.Text
                style={[
                  {
                    width: "100%",
                    color: AC.label,
                    fontSize: 16,
                    fontWeight: "600",
                  },
                  titleStyle,
                ]}
              >
                {props.children}
              </Animated.Text>
            );
          },
        }}
      />
      <ScrollContext.Provider value={ref}>{children}</ScrollContext.Provider>
    </BodyScrollView>
  );
}

function AnimatedShowHeaderBackgroundIos({ style }: { style: ViewStyle }) {
  const headerHeight = useReanimatedHeaderHeight();

  return (
    <Animated.View
      style={[
        {
          zIndex: 999,
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,

          maxHeight: headerHeight,
          minHeight: headerHeight,
          width: "auto",
          // height: "auto",
          borderBottomWidth: 0.5,
        },
        style,
      ]}
    >
      <BlurView
        intensity={100}
        tint={"systemChromeMaterial"}
        style={[
          StyleSheet.absoluteFill,
          {
            flex: 1,
          },
        ]}
      />
    </Animated.View>
  );
}

function AnimatedShowHeaderBackground({ style }: { style: ViewStyle }) {
  const theme = useColorScheme();

  return (
    <BlurView
      intensity={100}
      tint={
        theme === "dark" ? "systemChromeMaterialDark" : "systemChromeMaterial"
      }
      style={[
        StyleSheet.absoluteFill,
        {
          borderBottomWidth: 0.5,
        },
        style,
      ]}
    />
  );
}
