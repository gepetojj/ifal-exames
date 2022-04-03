import type { Exam } from "~/entities/Exam";

export interface IExamsRepo {
	findById(id: string): Promise<Exam | null>;
	getAll(): Promise<Exam[]>;
	getOngoing(): Promise<Exam[]>;
	getClosed(): Promise<Exam[]>;
	getFuture(): Promise<Exam[]>;
	// createNew(exam: Exam): Promise<void>;
}
