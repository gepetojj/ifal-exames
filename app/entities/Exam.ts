export type ITagType = "open" | "closed" | "future" | "free";
export type ITagColor = "red" | "green" | "blue" | "yellow";

export interface ITag {
	type: ITagType;
	color: ITagColor;
}

export interface IPeriod {
	startsAt: number;
	endsAt: number;
}

export type IShift = "morning" | "afternoon" | "night";
export type IModality = "integraded" | "subsequent";
export type ILevel = "mid" | "higher";

export interface ICourse {
	id: string;
	name: string;
	campus: string;
	modality: IModality;
	shift: IShift;
	vacancies: number;
}

export interface IDocument {
	id: string;
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
	level: ILevel;
	modality: IModality;
	vacancies: number;
	courses: ICourse[];
	documents: IDocument[];
}
