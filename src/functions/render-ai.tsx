"use server";

import { ChatUI } from "../components/ai/chatui";
import { AI } from "../context/ai-context";

export async function renderAI() {
  return (
    <AI>
      <ChatUI />
    </AI>
  );
}
