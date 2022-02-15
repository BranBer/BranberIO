import NextAuth from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import client from "../../../graphql/client";
import { LOGIN_FACEBOOK, LOGIN_GOOGLE } from "../../../graphql/mutations/auth";

export default NextAuth({
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
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
    async signIn(provider) {
      let { user, account, profile, email, credentials } = provider;
      console.log("provider");
      console.log(provider);

      return true;
    },
    async jwt(args) {
      let { token, account, user, profile } = args;

      console.log("ARGS");
      console.log(args);

      if (account) {
        token.accessToken = account.access_token;

        if (profile && user) {
          let params = {};

          if (account.provider) {
            let mutation = null;

            switch (account.provider) {
              case "google":
                mutation = LOGIN_GOOGLE;
                params = {
                  email: profile.email as string,
                  aud: profile.aud as string,
                  idToken: account.id_token as string,
                  displayName: profile.name as string,
                  picture: profile.picture,
                };
                break;
              case "facebook":
                mutation = LOGIN_FACEBOOK;
                params = {
                  email: token.email as string,
                  inputToken: token.accessToken as string,
                  displayName: token.name as string,
                  picture: token.picture as string,
                };
                break;
            }

            if (mutation) {
              console.log("MUTATING");
              let { data } = await client.mutate({
                mutation: mutation,
                variables: params,
              });
            }
          }
        }
      }

      return token;
    },
    async session({ session, token, user }) {
      session.accessToken = token.accessToken;

      return session;
    },
    redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url;
      // Allows relative callback URLs
      else if (url.startsWith("/")) return new URL(url, baseUrl).toString();
      return baseUrl;
    },
  },
  debug: true,
});
