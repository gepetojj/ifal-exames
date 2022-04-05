import { RemixI18Next, FileSystemBackend } from "remix-i18next";

import { i18nOptions } from "../config/i18n.config";

const backend = new FileSystemBackend(
	process.env.NODE_ENV === "development" ? "./public/locales" : "../locales"
);

export const remixI18next = new RemixI18Next(backend, {
	fallbackLng: i18nOptions.fallbackLng as string,
	supportedLanguages: i18nOptions.supportedLngs as string[],
});
