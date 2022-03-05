import Fuse from "fuse.js";
import { json } from "remix";
import type { Exam } from "~/entities/Exam";

import { getExams } from "./api/exams.server";

export interface ISearchExamsResult {
	query: string;
	page: number;
	exams: Exam[];
	filteredExams: Fuse.FuseResult<Exam>[];
}

export const searchExams = async (
	req: Request,
	predicate: (value: Exam, index: number, array: Exam[]) => unknown
): Promise<ISearchExamsResult> => {
	const url = new URL(req.url);
	const query = url.searchParams.get("search") || "";
	const page = url.searchParams.get("page") || 1;

	const exams = await getExams();
	if (exams.isError || !exams.data) {
		throw json("Não foi possível retornar os exames em andamento.", exams.errorCode || 500);
	}

	const specificExams = exams.data.filter(predicate);
	const fuse = new Fuse(specificExams, {
		includeScore: true,
		threshold: 0.4,
		keys: ["name", "tags", "campi", "offers", "level", "modality"],
	});
	const filteredExams = fuse.search(query);

	return {
		query: String(query) || "",
		page: Number(page) || 1,
		exams: specificExams,
		filteredExams: filteredExams,
	};
};
