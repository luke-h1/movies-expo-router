"use client";

import { useActions, useAIState, useUIState } from "@ai-sdk/rsc";
import React from "react";
import { View } from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Stack } from "expo-router";

import * as AC from "@bacons/apple-colors";

import { AI } from "@/src/context/ai-context";
import { nanoid } from "@/src/utils/nanoid";
import { tw } from "@/src/utils/tw";
import { IconSymbol } from "../ui/IconSymbol";
import { AnimatedLogo } from "./AnimatedLogo";
import { ChatContainer } from "./ChatContainer";
import { ChatToolbarInner } from "./ChatToolbar";
import { HeaderButton } from "./HeaderButton";
import { KeyboardFriendlyScrollView } from "./KeyboardFriendlyScrollView";

const HEADER_HEIGHT = 0;

function MessagesScrollView() {
  const [messages] = useUIState<typeof AI>();

  const { top, bottom } = useSafeAreaInsets();

  // Account for toolbar height: padding (16) + input (52) + bottom safe area + extra offset (50)
  const textInputHeight = 16 + 52 + bottom + 50 + 16;

  return (
    <>
      <KeyboardFriendlyScrollView
        style={[{ flex: 1 }, tw`md:w-[768px] max-w-[768px] md:mx-auto`]}
        contentInsetAdjustmentBehavior="automatic"
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: top + HEADER_HEIGHT + 24,
          paddingBottom: textInputHeight,
          gap: 16,
          flex: messages.length ? undefined : 1,
        }}
      >
        {
          // View messages in UI state
          messages.map((message) => (
            <View key={message.id}>{message.display}</View>
          ))
        }
      </KeyboardFriendlyScrollView>
      {messages.length === 0 && <AnimatedLogo />}
    </>
  );
}

export function ChatUI() {
  const [, setAIState] = useAIState<typeof AI>();
  const [messages, setMessages] = useUIState<typeof AI>();

  return (
    <ChatContainer>
      <Stack.Screen
        options={{
          headerRight: () => (
            <>
              {!!messages.length && (
                <HeaderButton
                  pressOpacity={0.7}
                  style={[
                    process.env.EXPO_OS === "web"
                      ? {
                          paddingHorizontal: 16,
                          alignItems: "center",
                          display: "flex",
                        }
                      : {
                          // Offset on the side so the margins line up. Unclear how to handle when this is used in headerLeft.
                          // We should automatically detect it somehow.
                          marginRight: -8,
                        },
                  ]}
                  onPress={() => {
                    setAIState({ chatId: nanoid(), messages: [] });
                    setMessages([]);
                  }}
                >
                  <IconSymbol name="square.and.pencil" color={AC.label} />
                </HeaderButton>
              )}
            </>
          ),
        }}
      />

      <MessagesScrollView />

      <ChatToolbar />
    </ChatContainer>
  );
}

function ChatToolbar() {
  const [messages, setMessages] = useUIState<typeof AI>();
  const { onSubmit } = useActions<typeof AI>();

  return (
    <ChatToolbarInner
      messages={messages}
      setMessages={setMessages}
      onSubmit={onSubmit}
    />
  );
}
