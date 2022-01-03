import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";
import client from "../graphql/client";
import Lavalamp from "../components/lavalamp";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <Lavalamp/>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}
export default MyApp;
