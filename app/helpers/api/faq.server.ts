import algoliasearch from "algoliasearch";
import { DbService } from "m3o/db";
import { Faq } from "~/entities/Faq";
import type { HandlerResponse } from "~/entities/HandlerResponse";

const m3oToken = process.env.M3O_TOKEN;
const algoliaApp = process.env.PUBLIC_ALGOLIA_APP;
const algoliaCrudToken = process.env.ALGOLIA_CRUD_TOKEN;
if (!m3oToken || !algoliaApp || !algoliaCrudToken) {
	throw new Error("O token de API para a M3O e Algolia são necessários.");
}

const dbService = new DbService(m3oToken);
const searchService = algoliasearch(algoliaApp, algoliaCrudToken);

export async function createFaq(data: Faq): Promise<HandlerResponse<string>> {
	try {
		const response = await dbService.create({
			table: "faq",
			record: data,
		});
		if (!response.id) return { isError: true, errorCode: 204 };

		const index = searchService.initIndex("dev_FAQ");
		await index.saveObject(data);

		return {
			isError: false,
			data: response.id,
		};
	} catch (err) {
		return {
			isError: true,
			// @ts-expect-error (`Code` não existe em `err` mas é definido por `userService`.)
			errorCode: err.Code || 500,
		};
	}
}

export async function deleteFaq(id: string): Promise<HandlerResponse<undefined>> {
	try {
		await dbService.delete({
			id,
			table: "faq",
		});

		const index = searchService.initIndex("dev_FAQ");
		await index.deleteObject(id);

		return { isError: false };
	} catch (err) {
		return {
			isError: true,
			// @ts-expect-error (`Code` não existe em `err` mas é definido por `userService`.)
			errorCode: err.Code || 500,
		};
	}
}
