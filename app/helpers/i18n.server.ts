import { RemixI18Next, FileSystemBackend } from "remix-i18next";

import { i18nOptions } from "./i18nOptions";

const backend = new FileSystemBackend("./public/locales");

export const remixI18next = new RemixI18Next(backend, {
	fallbackLng: i18nOptions.fallbackLng as string,
	supportedLanguages: i18nOptions.supportedLngs as string[],
});
