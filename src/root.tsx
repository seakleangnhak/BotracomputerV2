import { component$, isDev } from "@builder.io/qwik";
import { QwikCityProvider, RouterOutlet } from "@builder.io/qwik-city";
import { QwikPartytown } from './components/partytown/partytown';
import { RouterHead } from "./components/router-head/router-head";

import "./global.css";

export default component$(() => {
  /**
   * The root of a QwikCity site always start with the <QwikCityProvider> component,
   * immediately followed by the document's <head> and <body>.
   *
   * Don't remove the `<head>` and `<body>` elements.
   */

  const partytownScript = `
            window.dataLayer = window.dataLayer || [];
            window.gtag = function() {
              dataLayer.push(arguments);
            }
            gtag('js', new Date());
            gtag('config', 'G-7XL1BKJ430');
          `

  return (
    <QwikCityProvider>
      <head>
        <meta charset="utf-8" />
        <QwikPartytown forward={['gtag','dataLayer.push']} />
        <script async type="text/partytown" src="https://www.googletagmanager.com/gtag/js?id=G-7XL1BKJ430"/>
        <script type="text/partytown" dangerouslySetInnerHTML={partytownScript}/>
        {!isDev && (
          <link
            rel="manifest"
            href={`${import.meta.env.BASE_URL}manifest.json`}
          />
        )}
        <RouterHead />
      </head>
      <body lang="en">
        <RouterOutlet />
      </body>
    </QwikCityProvider>
  );
});
