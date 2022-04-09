import type { Backend, Language } from "remix-i18next";

export class I18NextProvider implements Backend {
	private url: URL;

	constructor(url: string) {
		this.url = new URL(url);
	}

	buildUrl(locale: string, namespace: string): string {
		return new URL(`locales/${locale}/${namespace}.json`, this.url).toString();
	}

	async getTranslations(namespace: string, locale: string): Promise<Language> {
		let url = this.buildUrl(locale, namespace);
		let response = await fetch(url, { headers: { accept: "application/json" } });

		if (!response.ok) {
			url = this.buildUrl(locale.toLowerCase(), namespace.toLowerCase());
			response = await fetch(url, { headers: { accept: "application/json" } });

			if (!response.ok) {
				throw new Error(`Não foi possível retornar a tradução '${locale}/${namespace}'.`);
			}
		}

		return response.json();
	}
}
