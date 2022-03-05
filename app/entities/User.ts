import { Role } from "./Role";

export type IGender = "male" | "female" | "other" | "undefined";

export type IEthnicity = "branco" | "preto" | "pardo" | "indigena" | "amarelo" | "undefined";

export type IKinship =
	| "mother"
	| "father"
	| "grandmother"
	| "grandfather"
	| "responsible"
	| "undefined";

export interface User {
	id: string;
	username: string;
	email: string;
	profile: {
		cpf: string;
		fullName: string;
		birthDay: string;
		gender: IGender;
		ethnicity: IEthnicity;
		birthState: string; // State ID
		birthCity: string; // City ID
		responsiblePersonFullName?: string;
		responsiblePersonKinship?: IKinship;
		phone: string;
		email: string;
		street: string;
		houseNumber: string;
		neighborhood: string;
		complement: string;
		cep: string;
		state: string; // State ID
		city: string; // City ID
		role: Role;
	};
}

export interface Account extends User {
	createdAt: number;
	updatedAt: number;
	verified: boolean;
	verifiedAt: number;
}

// Esconde parâmetros que não podem ser alterados ao atualizar um usuário.
export type UpdatableUser = Omit<User["profile"], "cpf" | "fullName" | "birthDay">;
