import i18next from "i18next";
import Detector from "i18next-browser-languagedetector";
import React from "react";
import { hydrate } from "react-dom";
import { initReactI18next, I18nextProvider } from "react-i18next";
import { RemixBrowser } from "remix";

import { defaultLanguage, defaultNs, languages } from "./helpers/translation";

if ("serviceWorker" in navigator) {
	window.addEventListener("load", () => {
		navigator.serviceWorker.register("/sw.js").then(() => {
			process.env.NODE_ENV === "development" && console.info("Service worker registered.");
		});
	});
}

i18next
	.use(initReactI18next)
	.use(Detector)
	.init({
		preload: ["pt-br"],
		supportedLngs: languages,
		fallbackLng: defaultLanguage,
		react: { useSuspense: false },
		defaultNS: defaultNs,
		detection: {
			order: ["path", "navigation", "htmlTag", "querystring"],
			lookupFromPathIndex: 0,
			lookupQuerystring: "lang",
		},
	})
	.then(() => {
		return hydrate(
			<I18nextProvider i18n={i18next}>
				<RemixBrowser />
			</I18nextProvider>,
			document
		);
	})
	.catch(err => {
		console.error(`Failed to init i18Next: ${err.message}`);
		console.error(err.stack);
	});
