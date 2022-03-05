export interface ITag {
	label: string;
	color: string;
}

export interface IPeriod {
	startsAt: number;
	endsAt: number;
}

export type IShift = "morning" | "afternoon" | "night";

export interface ICourse {
	id: number;
	name: string;
	campus: string;
	modality: string;
	shift: IShift;
	vacancies: number;
}

export interface IDocument {
	id: number;
	name: string;
	link: string;
	createdAt: number;
	updatedAt: number;
}

export interface Exam {
	id: string;
	name: string;
	tags: ITag[];
	isOpen: boolean;
	isClosed: boolean;
	isFuture: boolean;
	subscriptionPeriod: IPeriod;
	resourcesPeriod: IPeriod;
	campi: string[];
	offers: string[];
	level: string;
	modality: string;
	vacancies: number;
	courses: ICourse[];
	documents: IDocument[];
}
