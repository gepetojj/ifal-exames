import type { Backend, Language } from "remix-i18next";

export class I18NextProvider implements Backend {
	private url: URL;

	constructor(url: string) {
		this.url = new URL(url);
	}

	async getTranslations(namespace: string, locale: string): Promise<Language> {
		const url = new URL(`locales/${locale}/${namespace}.json`, this.url);
		const response = await fetch(url.toString(), { headers: { accept: "application/json" } });

		if (!response.ok) {
			throw new Error(`Não foi possível retornar a tradução '${locale}/${namespace}'.`);
		}

		return response.json();
	}
}
