import { NextResponse } from "next/server";
import { StreamClient } from "@stream-io/node-sdk";

export async function GET() {
  try {
    const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
    const secretKey = process.env.STREAM_SECRET_KEY;

    if (!apiKey || !secretKey) {
      return NextResponse.json(
        {
          error: "API keys not configured",
          success: false,
        },
        { status: 500 }
      );
    }

    // Test Stream client creation
    const streamClient = new StreamClient(apiKey, secretKey);

    // Test token generation
    const testToken = streamClient.generateUserToken({ user_id: "test-user" });

    return NextResponse.json({
      success: true,
      message: "Stream API key is valid",
      tokenLength: testToken.length,
      apiKeyLength: apiKey.length,
      secretKeyLength: secretKey.length,
    });
  } catch (error) {
    console.error("Stream test error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
        success: false,
      },
      { status: 500 }
    );
  }
}
