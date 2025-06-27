import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      email: string;
      name: string;
      image: string;
      role: "candidate" | "interviewer";
    };
  }

  interface User {
    email: string;
    name: string;
    image: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    email: string;
    name: string;
    picture: string;
    role: "candidate" | "interviewer";
  }
}
