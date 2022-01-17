import NextAuth from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  pages: {
    signIn: "/login",
  },
  providers: [
    FacebookProvider({
      clientId: process.env.facebook_client_id!,
      clientSecret: process.env.facebook_secret!,
    }),
    GoogleProvider({
      clientId: process.env.google_client_id!,
      clientSecret: process.env.google_secret!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      return true;
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }

      return token;
    },
    async session({ session, token, user }) {
      session.accessToken = token.accessToken;

      return session;
    },
  },
});
