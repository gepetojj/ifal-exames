import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import React from "react";
import { hydrateRoot } from "react-dom/client";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { RemixBrowser } from "remix";
import { disableReactDevTools } from "~/helpers/disableDevTools.client";

import { i18nOptions } from "./config/i18n.config";

if ("serviceWorker" in navigator) {
	window.addEventListener("load", () => navigator.serviceWorker.register("/sw.js"));
}

if (process.env.NODE_ENV === "production") disableReactDevTools();

i18next
	.use(LanguageDetector)
	.use(initReactI18next)
	.init(i18nOptions)
	.then(() => {
		return hydrateRoot(
			document,
			<I18nextProvider i18n={i18next}>
				<RemixBrowser />
			</I18nextProvider>
		);
	})
	.catch(() => {
		console.error("Não foi possível carregar as traduções!");
		return hydrateRoot(document, <RemixBrowser />);
	});
