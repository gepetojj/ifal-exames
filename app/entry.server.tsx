import { createInstance } from "i18next";
import Detector from "i18next-browser-languagedetector";
import React from "react";
import { renderToString } from "react-dom/server";
import { initReactI18next, I18nextProvider } from "react-i18next";
import { RemixServer } from "remix";
import type { EntryContext } from "remix";

import { defaultLanguage, defaultNs, languages } from "./helpers/translation";

export default async function handleRequest(
	request: Request,
	responseStatusCode: number,
	responseHeaders: Headers,
	remixContext: EntryContext
) {
	const i18n = createInstance();
	await i18n
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
		});

	const markup = renderToString(
		<I18nextProvider i18n={i18n}>
			<RemixServer context={remixContext} url={request.url} />
		</I18nextProvider>
	);

	responseHeaders.set("Content-Type", "text/html");

	return new Response("<!DOCTYPE html>" + markup, {
		status: responseStatusCode,
		headers: responseHeaders,
	});
}
