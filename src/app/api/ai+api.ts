import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const tourismResponseSchema = z.object({
  city: z.string(),
  overview: z.string(),
  top_attractions: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      estimated_time: z.string(),
    })
  ),
  local_cuisine: z.array(z.string()),
  travel_tips: z.array(z.string()),
  best_time_to_visit: z.string(),
  estimated_budget: z.string(),
});

export async function GET(request: Request) {
  const API_KEY = process.env.API_KEY;

  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city") as string;

  const apiKey = searchParams.get("apiKey");
  if (apiKey !== API_KEY) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (!city) {
    return new Response("No city provided", { status: 400 });
  }

  try {
    const encoder = new TextEncoder();
    const customStream = new TransformStream();
    const writer = customStream.writable.getWriter();

    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant that provides comprehensive tourism information. Provide structured, detailed recommendations for travelers.`,
        },
        {
          role: "user",
          content: `Help me plan my trip to ${city}. Provide top attractions, local cuisine recommendations, travel tips, best time to visit, and estimated budget.`,
        },
      ],
      response_format: zodResponseFormat(tourismResponseSchema, "tourism_plan"),
      stream: true,
      stream_options: {
        include_obfuscation: true,
      },
    });

    (async () => {
      try {
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content;
          if (content) {
            await writer.write(encoder.encode(content));
          }
        }
        await writer.close();
      } catch (error) {
        console.error("Stream processing error:", error);
        await writer.abort(error);
      }
    })();

    return new Response(customStream.readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("API error:", error);
    return new Response("Error processing request", { status: 500 });
  }
}
