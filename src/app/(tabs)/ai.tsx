/// <reference types="react/canary" />

import { AnimatedLogo } from "@/src/components/ai/AnimatedLogo";
import { ChatContainer } from "@/src/components/ai/ChatContainer";
import { ChatToolbarInner } from "@/src/components/ai/ChatToolbar";
import { renderAI } from "@/src/functions/render-ai";
import React from "react";

export { ErrorBoundary } from "expo-router";

export default function Index() {
  return <React.Suspense fallback={<Loading />}>{renderAI()}</React.Suspense>;
}

function Loading() {
  return (
    <ChatContainer
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <AnimatedLogo />
      <ChatToolbarInner
        disabled
        messages={[]}
        setMessages={() => {}}
        onSubmit={async () => ({
          id: Math.random().toString(36).slice(2),
          display: <></>,
        })}
      />
    </ChatContainer>
  );
}
