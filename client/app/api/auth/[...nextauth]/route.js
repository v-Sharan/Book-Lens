import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { client, GetUserByName } from "@utils";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session }) {
      const sessionUser = await client.fetch(
        GetUserByName(session?.user?.name)
      );
      const sessiondata = {
        ...session,
        user: { ...session.user, id: sessionUser[0]?._id },
      };
      return sessiondata;
    },
    async signIn({ account, profile, user, credentials }) {
      try {
        const { name, picture, sub } = profile;

        await client.createIfNotExists({
          _id: sub,
          _type: "user",
          userName: name,
          image: picture,
        });

        return true;
      } catch (error) {
        console.log("Error checking if user exists: ", error.message);
        return false;
      }
    },
  },
});

export { handler as GET, handler as POST };
