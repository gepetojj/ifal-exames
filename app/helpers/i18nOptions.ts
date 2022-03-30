import type { InitOptions } from "i18next";

export const i18nOptions: InitOptions = {
	/* debug: process.env.NODE_ENV !== "production", */
	supportedLngs: ["pt-BR", "en", "es"],
	fallbackLng: "pt-BR",
	defaultNS: "common",
	react: { useSuspense: false },
	resources: {},
	detection: {
		order: ["path", "querystring", "localStorage", "navigator"],
		lookupQuerystring: "lang",
		lookupLocalStorage: "language",
		caches: ["localStorage"],
	},
	interpolation: {
		escapeValue: false,
	},
};
