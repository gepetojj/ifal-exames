import Fuse from "fuse.js";
import { json } from "remix";
import type { Exam } from "~/entities/Exam";

export interface ISearchExamsResult {
	query: string;
	page: number;
	exams: Exam[];
	filteredExams: Fuse.FuseResult<Exam>[];
}

export const searchExams = async (
	req: Request,
	fetchFunction: () => Promise<Exam[]>
): Promise<ISearchExamsResult> => {
	const url = new URL(req.url);
	const query = url.searchParams.get("search") || "";
	const page = url.searchParams.get("page") || 1;

	const exams = await fetchFunction();
	if (!exams || !exams.length) {
		throw json("Não foi possível retornar os exames.", 404);
	}

	const fuse = new Fuse(exams, {
		includeScore: true,
		threshold: 0.4,
		keys: ["name", "tags", "campi", "offers", "level", "modality"],
	});
	const filteredExams = fuse.search(query);

	return {
		query: String(query) || "",
		page: Number(page) || 1,
		exams,
		filteredExams,
	};
};
