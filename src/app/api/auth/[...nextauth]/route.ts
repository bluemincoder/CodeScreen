import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
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
          token.role = userData?.role || "interviewer";
        } catch (error) {
          console.error("Error fetching user role:", error);
          token.role = "interviewer";
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.image = token.picture;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    newUser: "/auth/role-selection",
  },
  session: {
    strategy: "jwt",
  },
});

export { handler as GET, handler as POST };
