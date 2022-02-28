import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";
import client from "../graphql/client";
import Lavalamp from "../components/lavalamp";
import { SessionProvider } from "next-auth/react";
import "react-quill/dist/quill.snow.css";
import "../styles/BranberQuillTheme.scss";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <ApolloProvider client={client}>
        <Lavalamp />
        <Component {...pageProps} />
      </ApolloProvider>
    </SessionProvider>
  );
}
export default MyApp;
