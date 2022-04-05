import { RemixI18Next } from "remix-i18next";
import { I18NextProvider } from "~/providers/implementations/I18NextProvider.server";

import { i18nOptions } from "../config/i18n.config";

const backend = new I18NextProvider(
	process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://ifal.vercel.app"
);

export const remixI18next = new RemixI18Next(backend, {
	fallbackLng: i18nOptions.fallbackLng as string,
	supportedLanguages: i18nOptions.supportedLngs as string[],
});
