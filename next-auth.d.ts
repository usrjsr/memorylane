import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

// 1. Augment the NextAuth User type to include 'id'
interface CustomUser extends DefaultUser {
  id: string; // The MongoDB/Mongoose ObjectId converted to a string
}

// 2. Augment the NextAuth Session type to include 'id' on the user object
declare module "next-auth" {
  interface Session {
    user: CustomUser & DefaultSession['user']
  }
  interface User extends CustomUser {}
}

// 3. Augment the JWT token (if using JWT strategy)
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}