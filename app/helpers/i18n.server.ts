import { resolve } from "path";
import { RemixI18Next, FileSystemBackend } from "remix-i18next";

const backend = new FileSystemBackend(resolve(process.cwd(), "public", "locales"));
export const i18n = new RemixI18Next(backend, {
	fallbackLng: "pt-br",
	supportedLanguages: ["pt-br", "en", "es"],
});
