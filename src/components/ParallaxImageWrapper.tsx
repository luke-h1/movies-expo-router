"use client";

import { ReactNode } from "react";
import { View } from "react-native";

interface Props {
  children: ReactNode;
}

const HEADER_HEIGHT = 300;

export function ParallaxImageWrapper({ children }: Props) {
  return (
    <View
      style={{
        height: HEADER_HEIGHT,
      }}
    >
      {children}
    </View>
  );
}
