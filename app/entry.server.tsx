import { createInstance } from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import React from "react";
import { renderToString } from "react-dom/server";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { RemixServer } from "remix";
import type { EntryContext } from "remix";

import { i18nOptions } from "./config/i18n.config";

export default async function handleRequest(
	request: Request,
	responseStatusCode: number,
	responseHeaders: Headers,
	remixContext: EntryContext
) {
	const i18n = createInstance();
	await i18n.use(LanguageDetector).use(initReactI18next).init(i18nOptions);

	const markup = renderToString(
		<I18nextProvider i18n={i18n}>
			<RemixServer context={remixContext} url={request.url} />
		</I18nextProvider>
	);

	responseHeaders.set("Content-Type", "text/html");
	responseHeaders.set("X-Ifal-Service", "exames");
	responseHeaders.set("Strict-Transport-Security", "max-age=604800; includeSubDomains; preload");
	responseHeaders.set("X-Content-Type-Options", "nosniff");
	responseHeaders.set("X-Frame-Options", "SAMEORIGIN");
	responseHeaders.set("X-XSS-Protection", "1; mode=block");

	return new Response("<!DOCTYPE html>" + markup, {
		status: responseStatusCode,
		headers: responseHeaders,
	});
}
