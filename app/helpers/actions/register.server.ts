import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import type { IAlertProps } from "~/components/data/Alert";
import type { CEP } from "~/entities/CEP";
import { remixI18next } from "~/helpers/i18n.server";
import {
	birthDayValidator,
	cepValidator,
	complementValidator,
	cpfValidator,
	emailValidator,
	houseNumberValidator,
	passwordValidator,
	phoneValidator,
	textValidator,
} from "~/helpers/validators/index.server";
import { UsersRepo } from "~/repositories/implementations/UsersRepo.server";

import { encrypt } from "../crypto.server";

export interface IRegisterActionData {
	formError?: IAlertProps;
	fieldErrors?: {
		cpf?: string;
		fullName?: string;
		birthDay?: string;
		phone?: string;
		email?: string;
		emailConfirm?: string;
		street?: string;
		houseNumber?: string;
		neighborhood?: string;
		complement?: string;
		cep?: string;
		state?: string;
		city?: string;
		password?: string;
		passwordConfirm?: string;
	};
	completed?: boolean;
}

export async function register(req: Request): Promise<IRegisterActionData> {
	const t = await remixI18next.getFixedT(req, "translation");
	const form = await req.formData();

	// Forçando que sejam strings para evitar problemas depois da verificação. Não afeta a validação do input.
	const cpf = form.get("cpf")?.toString() as string;
	const fullName = form.get("fullName")?.toString() as string;
	const birthDay = form.get("birthDay")?.toString() as string;
	const phone = form.get("phone")?.toString() as string;
	const email = form.get("email")?.toString() as string;
	const emailConfirm = form.get("emailConfirm")?.toString() as string;
	const cep = form.get("cep")?.toString() as string;
	const houseNumber = form.get("houseNumber")?.toString() as string;
	const complement = form.get("complement")?.toString() as string;
	const password = form.get("password")?.toString() as string;
	const passwordConfirm = form.get("passwordConfirm")?.toString() as string;

	const cpfErr = cpfValidator(cpf, {
		isEmpty: t("validator.required"),
		length: t("validator.length", { length: 11 }),
		regex: t("validator.numberOnly"),
	});
	const nameErr = textValidator(fullName, {
		isEmpty: t("validator.required"),
		regex: t("validator.textOnly"),
	});
	const birthDayErr = birthDayValidator(birthDay, {
		isEmpty: t("validator.required"),
		length: t("validator.length", { length: 8 }),
		regex: t("validator.numberOnly"),
	});
	const phoneErr = phoneValidator(phone, {
		isEmpty: t("validator.required"),
		length: t("validator.length", { length: 9 }),
		regex: t("validator.numberOnly"),
	});
	const emailErr = emailValidator(email, emailConfirm, {
		isEmpty: t("validator.required"),
		isEmail: t("validator.emailOnly"),
		equals: t("validator.emailEquals"),
	});
	const emailConfirmErr = emailValidator(emailConfirm, email, {
		isEmpty: t("validator.required"),
		isEmail: t("validator.emailOnly"),
		equals: t("validator.emailEquals"),
	});
	const cepErr = cepValidator(cep, {
		isEmpty: t("validator.required"),
		length: t("validator.length", { length: 8 }),
		regex: t("validator.numberOnly"),
	});
	const houseNumberErr = houseNumberValidator(houseNumber, {
		isEmpty: t("validator.required"),
		regex: t("validator.numberOnly"),
	});
	const complementErr = complementValidator(complement, {
		isEmpty: t("validator.required"),
		regex: t("validator.textOnly"),
	});
	const passwordErr = passwordValidator(password, passwordConfirm, {
		isEmpty: t("validator.required"),
		length: t("validator.passwordLength"),
		isStrong: t("validator.passwordStrong"),
		equals: t("validator.passwordEquals"),
	});
	const passwordConfirmErr = passwordValidator(passwordConfirm, password, {
		isEmpty: t("validator.required"),
		length: t("validator.passwordLength"),
		isStrong: t("validator.passwordStrong"),
		equals: t("validator.passwordEquals"),
	});

	const errors = [
		cpfErr,
		nameErr,
		birthDayErr,
		phoneErr,
		emailErr,
		emailConfirmErr,
		cepErr,
		houseNumberErr,
		complementErr,
		passwordErr,
		passwordConfirmErr,
	];

	if (errors.find(error => !!error)) {
		return {
			formError: {
				label: t("register.formError"),
				variant: "alert",
			},
			fieldErrors: {
				cpf: cpfErr,
				fullName: nameErr,
				birthDay: birthDayErr,
				phone: phoneErr,
				email: emailErr,
				emailConfirm: emailConfirmErr,
				cep: cepErr,
				houseNumber: houseNumberErr,
				complement: complementErr,
				password: passwordErr,
				passwordConfirm: passwordConfirmErr,
			},
		};
	}

	const response = await fetch(`https://brasilapi.com.br/api/cep/v2/${cep}`);
	if (!response.ok) {
		return {
			formError: { label: t("register.formError"), variant: "alert" },
			fieldErrors: { cep: t("register.verifyPostalCode") },
		};
	}
	const { state, city, street, neighborhood }: CEP = await response.json();

	const secureCPF = encrypt(email, cpf);
	const secureCEP = encrypt(email, cep);
	const secureState = encrypt(email, state);
	const secureCity = encrypt(email, city);
	const secureNeighborhood = encrypt(email, neighborhood);

	const usersRepo = new UsersRepo();
	const emailExists = await usersRepo.emailExists(email);
	if (emailExists) {
		return {
			formError: {
				label: t("register.emailAlreadyExists"),
				variant: "alert",
			},
			fieldErrors: {
				email: t("register.emailAlreadyExists"),
			},
		};
	}

	const passwordHash = await bcrypt.hash(password as string, 12);

	try {
		await usersRepo.createNew({
			id: uuid(),
			email,
			passwordHash,
			profile: {
				cpf: secureCPF,
				fullName,
				birthDay,
				gender: "noinfo",
				ethnicity: "noinfo",
				birthState: "",
				birthCity: "",
				responsiblePersonFullName: null,
				responsiblePersonKinship: null,
				phone,
				street,
				houseNumber,
				neighborhood: secureNeighborhood,
				complement,
				cep: secureCEP,
				state: secureState,
				city: secureCity,
				role: "student",
			},
		});
	} catch (err) {
		return {
			formError: {
				label: t("register.failed"),
				variant: "error",
			},
		};
	}

	return { completed: true };
}
