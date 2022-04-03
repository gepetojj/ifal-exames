import { Role } from "./Role";

export type IGender = "male" | "female" | "other" | "noinfo";

export type IEthnicity = "white" | "black" | "mulatto" | "indigenous" | "yellow" | "noinfo";

export type IKinship =
	| "mother"
	| "father"
	| "grandmother"
	| "grandfather"
	| "responsible"
	| "noinfo";

export interface User {
	id: string;
	email: string;
	passwordHash: string;
	profile: {
		cpf: string;
		fullName: string;
		birthDay: string;
		gender: IGender;
		ethnicity: IEthnicity;
		birthState: string;
		birthCity: string;
		responsiblePersonFullName: string | null;
		responsiblePersonKinship: IKinship | null;
		phone: string;
		street: string;
		houseNumber: string;
		neighborhood: string;
		complement: string;
		cep: string;
		state: string;
		city: string;
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
