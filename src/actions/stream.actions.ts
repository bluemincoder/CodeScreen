"use server";

import { getServerSession } from "next-auth/next";
import { StreamClient } from "@stream-io/node-sdk";
import { sanitizeUserId } from "@/lib/utils";

export const streamTokenProvider = async () => {
  try {
    console.log("Starting Stream token generation...");

    const session = await getServerSession();
    console.log("Session:", session ? "Found" : "Not found");
    console.log("User email:", session?.user?.email);

    if (!session?.user?.email) {
      throw new Error("User not authenticated");
    }

    const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
    const secretKey = process.env.STREAM_SECRET_KEY;

    console.log("API Key available:", !!apiKey);
    console.log("Secret Key available:", !!secretKey);
    console.log("API Key length:", apiKey?.length);

    if (!apiKey || !secretKey) {
      throw new Error("Stream API key or secret key not configured");
    }

    // Validate API key format (should be a string without spaces)
    if (apiKey.includes(" ") || secretKey.includes(" ")) {
      throw new Error(
        "Stream API keys contain spaces - please fix .env.local file"
      );
    }

    console.log("Creating Stream client...");
    const streamClient = new StreamClient(apiKey, secretKey);

    // Test if the API key is valid by trying to make a simple request
    try {
      console.log("Testing Stream API key validity...");
      // This will throw an error if the API key is invalid
      streamClient.generateUserToken({
        user_id: "test-user",
      });
      console.log("Stream API key is valid");
    } catch (error) {
      console.error("Stream API key validation failed:", error);
      throw new Error("Invalid Stream API key or secret key");
    }

    const sanitizedUserId = sanitizeUserId(session.user.email);
    console.log("Sanitized user ID:", sanitizedUserId);

    console.log("Generating user token...");
    const token = streamClient.generateUserToken({ user_id: sanitizedUserId });

    console.log(`Generated token for user: ${sanitizedUserId}`);
    console.log("Token length:", token.length);

    return token;
  } catch (error) {
    console.error("Error generating Stream token:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
};
