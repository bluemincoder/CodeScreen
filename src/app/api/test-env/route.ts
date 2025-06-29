import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
  const secretKey = process.env.STREAM_SECRET_KEY;

  return NextResponse.json({
    apiKeyAvailable: !!apiKey,
    secretKeyAvailable: !!secretKey,
    apiKeyLength: apiKey?.length || 0,
    secretKeyLength: secretKey?.length || 0,
    apiKeyHasSpaces: apiKey?.includes(" ") || false,
    secretKeyHasSpaces: secretKey?.includes(" ") || false,
    apiKeyFirstChars: apiKey?.substring(0, 4) || "N/A",
    secretKeyFirstChars: secretKey?.substring(0, 4) || "N/A",
  });
}
