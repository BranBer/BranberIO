import NextAuth from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import client from "../../../graphql/client";
import LOGIN_GOOGLE from "../../../graphql/mutations/auth";

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
    async signIn(provider) {
      let { user, account, profile, email, credentials } = provider;
      console.log("PROVIDER");
      console.log(provider);
      console.log("PROFILE");
      console.log(profile);
      console.log("\n");
      console.log("ACCOUNT");
      console.log(account);

      return true;
    },
    async jwt(args) {
      let { token, account, user, profile } = args;

      // console.log("ARGS");
      // console.log(args);
      // console.log("\n");

      if (account) {
        token.accessToken = account.access_token;

        if (profile && user) {
          let params = {
            email: profile.email as string,
            aud: profile.aud as string,
            idToken: account.id_token as string,
            displayName: profile.name as string,
            picture: profile.picture,
          };

          // let { data } = await client.mutate({
          //   mutation: LOGIN_GOOGLE,
          //   variables: params,
          // });
        }
      }

      return token;
    },
    async session({ session, token, user }) {
      session.accessToken = token.accessToken;

      return session;
    },
  },
});
