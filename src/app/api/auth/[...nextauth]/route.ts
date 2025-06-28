import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }: any) {
      if (account && user) {
        // First time sign in
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;

        // Sync user to Convex
        try {
          await convex.mutation(api.users.syncUser, {
            name: user.name || "",
            email: user.email || "",
            image: user.image || undefined,
          });
        } catch (error) {
          console.error("Error syncing user to Convex:", error);
        }
      }

      // Get user role from Convex
      if (token.email) {
        try {
          const userData = await convex.query(api.users.getUserByEmail, {
            email: token.email,
          });
          token.role = userData?.role || null; // Allow null for users without role
        } catch (error) {
          console.error("Error fetching user role:", error);
          token.role = null;
        }
      }

      return token;
    },
    async session({ session, token }: any) {
      if (token) {
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.image = token.picture;
        session.user.role = token.role;
      }
      return session;
    },
    async redirect({ url, baseUrl }: any) {
      // If user doesn't have a role, redirect to role selection
      if (url.startsWith(baseUrl) && !url.includes("/auth/role-selection")) {
        // This will be handled in the client-side redirect logic
        return url;
      }
      return url;
    },
  },
  pages: {
    signIn: "/auth/signin",
    newUser: "/auth/role-selection",
  },
  session: {
    strategy: "jwt" as const,
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
