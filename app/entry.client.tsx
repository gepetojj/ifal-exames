import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import React from "react";
import { hydrate } from "react-dom";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { RemixBrowser } from "remix";

import { i18nOptions } from "./helpers/i18nOptions";

if ("serviceWorker" in navigator) {
	window.addEventListener("load", () => navigator.serviceWorker.register("/sw.js"));
}

i18next
	.use(LanguageDetector)
	.use(initReactI18next)
	.init(i18nOptions)
	.then(() => {
		return hydrate(
			<I18nextProvider i18n={i18next}>
				<RemixBrowser />
			</I18nextProvider>,
			document
		);
	})
	.catch(() => {
		console.error("Não foi possível carregar as traduções!");
		return hydrate(<RemixBrowser />, document);
	});
