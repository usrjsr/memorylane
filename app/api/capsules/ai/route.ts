import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import {
  generateCaption,
  summarizeText,
  enhanceDescription,
  suggestMemoryIdeas,
} from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { action, text, theme } = body;

    console.log("[AI API] Request:", {
      action,
      textLength: text?.length,
      theme,
    });

    let result;

    switch (action) {
      case "generate-caption":
        if (!text) return new NextResponse("Text required", { status: 400 });
        result = await generateCaption(text);
        break;

      case "summarize":
        if (!text) return new NextResponse("Text required", { status: 400 });
        result = await summarizeText(text);
        break;

      case "enhance":
        if (!text) return new NextResponse("Text required", { status: 400 });
        result = await enhanceDescription(text);
        break;

      case "suggest-ideas":
        if (!theme) return new NextResponse("Theme required", { status: 400 });
        result = await suggestMemoryIdeas(theme);
        console.log("[AI API] Suggest Ideas Result:", result);
        break;

      default:
        return new NextResponse("Invalid action", { status: 400 });
    }

    return NextResponse.json({ result });
  } catch (error) {
    console.error("[AI API] Error:", error);

    return NextResponse.json({
      result: "✨ This memory is special — words will find it soon.",
      fallback: true,
    });
  }
}
