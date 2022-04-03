import { firestore } from "~/config/firebase.config";
import type { Exam } from "~/entities/Exam";

import type { IExamsRepo } from "../IExamsRepo";

export class ExamsRepo implements IExamsRepo {
	async findById(id: string): Promise<Exam | null> {
		const query = await firestore.collection("exams").doc(id).get();
		if (!query.exists || !query.data()) return null;
		return query.data() as Exam;
	}

	async getAll(): Promise<Exam[]> {
		const query = await firestore.collection("exams").get();
		if (query.empty || !query.docs) return [];

		const exams: Exam[] = [];
		for (const exam of query.docs) exams.push(exam.data() as Exam);
		return exams;
	}

	async getOngoing(): Promise<Exam[]> {
		const query = await firestore.collection("exams").where("isOpen", "==", true).get();
		if (query.empty || !query.docs) return [];

		const exams: Exam[] = [];
		for (const exam of query.docs) exams.push(exam.data() as Exam);
		return exams;
	}

	async getClosed(): Promise<Exam[]> {
		const query = await firestore.collection("exams").where("isClosed", "==", true).get();
		if (query.empty || !query.docs) return [];

		const exams: Exam[] = [];
		for (const exam of query.docs) exams.push(exam.data() as Exam);
		return exams;
	}

	async getFuture(): Promise<Exam[]> {
		const query = await firestore.collection("exams").where("isFuture", "==", true).get();
		if (query.empty || !query.docs) return [];

		const exams: Exam[] = [];
		for (const exam of query.docs) exams.push(exam.data() as Exam);
		return exams;
	}
}
