/* eslint-disable @next/next/no-document-import-in-page */
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Branded tab icon — SVG for modern browsers, PNG/ICO fallbacks */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#3B5BDB" />
      </Head>
      <body>
        <Main />
        <NextScript />
        <div id="modal-root" />
      </body>
    </Html>
  );
}
