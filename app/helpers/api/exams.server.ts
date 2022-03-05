import { DbService } from "m3o/db";
import type { Exam } from "~/entities/Exam";
import type { HandlerResponse } from "~/entities/HandlerResponse";

const m3oToken = process.env.M3O_TOKEN;
if (!m3oToken) throw new Error("O token de API para a M3O é necessário.");
const dbService = new DbService(m3oToken);

export async function getExams(): Promise<HandlerResponse<Exam[]>> {
	try {
		const response = await dbService.read({
			table: "exams",
		});
		if (!response.records || !response.records.length) {
			return { isError: true, errorCode: 204 };
		}

		const exams: Exam[] = [];

		for (const exam of response.records) {
			exams.push({
				id: exam.id,
				name: exam.name,
				tags: exam.tags,
				isOpen: exam.isOpen,
				isClosed: exam.isClosed,
				isFuture: exam.isFuture,
				subscriptionPeriod: exam.subscriptionPeriod,
				resourcesPeriod: exam.resourcesPeriod,
				campi: exam.campi,
				offers: exam.offers,
				level: exam.level,
				modality: exam.modality,
				vacancies: exam.vacancies,
				courses: exam.courses,
				documents: exam.documents,
			});
		}

		return { isError: false, data: exams };
	} catch (err) {
		return {
			isError: true,
			// @ts-expect-error (`Code` não existe em `err` mas é definido por `userService`.)
			errorCode: err.Code || 500,
		};
	}
}

export async function getExam(id: string): Promise<HandlerResponse<Exam>> {
	try {
		const response = await dbService.read({
			table: "exams",
			query: `id == '${id}'`,
		});
		if (!response.records || !response.records.length) {
			return { isError: true, errorCode: 204 };
		}

		const { records } = response;
		const exam: Exam = {
			id: records[0].id,
			name: records[0].name,
			tags: records[0].tags,
			isOpen: records[0].isOpen,
			isClosed: records[0].isClosed,
			isFuture: records[0].isFuture,
			subscriptionPeriod: records[0].subscriptionPeriod,
			resourcesPeriod: records[0].resourcesPeriod,
			campi: records[0].campi,
			offers: records[0].offers,
			level: records[0].level,
			modality: records[0].modality,
			vacancies: records[0].vacancies,
			courses: records[0].courses,
			documents: records[0].documents,
		};

		return { isError: false, data: exam };
	} catch (err) {
		return {
			isError: true,
			// @ts-expect-error (`Code` não existe em `err` mas é definido por `userService`.)
			errorCode: err.Code || 500,
		};
	}
}
