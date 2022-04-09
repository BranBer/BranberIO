import "../styles/globals.css";
import type { AppProps } from "next/app";
import Lavalamp from "../components/lavalamp";

function MyApp({ Component, pageProps: { ...pageProps } }: AppProps) {
  return (
    <>
      <Lavalamp />
      <Component {...pageProps} />
    </>
  );
}
export default MyApp;
