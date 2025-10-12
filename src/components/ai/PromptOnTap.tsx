"use client";

import { AI } from "@/src/context/ai-context";
import { useActions, useUIState } from "@ai-sdk/rsc";
import React, { useCallback } from "react";
import { TouchableOpacityProps } from "react-native";
import TouchableBounce from "../ui/TouchableBounce";
import { UserMessage } from "./UserMessage";

export function PromptOnTap({
  prompt,
  onPress,
  ...props
}: { prompt: string | [string, string] } & TouchableOpacityProps) {
  const onPressPrompt = usePromptOnPress(prompt);
  return (
    <TouchableBounce
      {...props}
      onPress={async (e) => {
        onPress?.(e);
        onPressPrompt();
      }}
    />
  );
}

function usePromptOnPress(prompt: string | [string, string]) {
  const [, setMessages] = useUIState<typeof AI>();
  const { onSubmit } = useActions<typeof AI>();

  return useCallback(async () => {
    const [displayPrompt, detailedPrompt] = Array.isArray(prompt)
      ? prompt
      : [prompt, prompt];
    setMessages((currentMessages: any[]) => [
      ...currentMessages,
      {
        id: Date.now(),
        display: <UserMessage>{displayPrompt}</UserMessage>,
      },
    ]);
    const response = await onSubmit(detailedPrompt);
    setMessages((currentMessages: any[]) => [...currentMessages, response]);
  }, [setMessages, onSubmit, prompt]);
}
