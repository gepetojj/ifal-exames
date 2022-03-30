import { v4 as uuid } from "uuid";
import type { IAlertProps } from "~/components/data/Alert";
import type { CEP } from "~/entities/CEP";
import { createUser } from "~/helpers/api/users/users.server";
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

	const cpf = form.get("cpf")?.toString();
	const fullName = form.get("fullName")?.toString();
	const birthDay = form.get("birthDay")?.toString();
	const phone = form.get("phone")?.toString();
	const email = form.get("email")?.toString();
	const emailConfirm = form.get("emailConfirm")?.toString();
	const cep = form.get("cep")?.toString();
	const houseNumber = form.get("houseNumber")?.toString();
	const complement = form.get("complement")?.toString();
	const password = form.get("password")?.toString();
	const passwordConfirm = form.get("passwordConfirm")?.toString();

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

	if (errors.find(error => error !== undefined)) {
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

	// @ts-expect-error (`Email` nem `CPF` podem ser `undefined`, já foi verificado.)
	const secureCPF = encrypt(email, cpf);
	// @ts-expect-error (`Email` nem `CEP` podem ser `undefined`, já foi verificado.)
	const secureCEP = encrypt(email, cep);
	// @ts-expect-error (`Email` nem `State` podem ser `undefined`, já foi verificado.)
	const secureState = encrypt(email, state);
	// @ts-expect-error (`Email` nem `City` podem ser `undefined`, já foi verificado.)
	const secureCity = encrypt(email, city);
	// @ts-expect-error (`Email` nem `Neighborhood` podem ser `undefined`, já foi verificado.)
	const secureNeighborhood = encrypt(email, neighborhood);

	const userCreation = await createUser(
		{
			id: uuid(),
			// @ts-expect-error (`Username` não pode ser `undefined`, já foi verificado.)
			username: email,
			// @ts-expect-error (`Email` não pode ser `undefined`, já foi verificado.)
			email,
			profile: {
				cpf: secureCPF,
				// @ts-expect-error (`FullName` não pode ser `undefined`, já foi verificado.)
				fullName,
				// @ts-expect-error (`BirthDay` não pode ser `undefined`, já foi verificado.)
				birthDay,
				gender: "noinfo",
				ethnicity: "noinfo",
				birthState: "",
				birthCity: "",
				responsiblePersonFullName: undefined,
				responsiblePersonKinship: undefined,
				// @ts-expect-error (`Phone` não pode ser `undefined`, já foi verificado.)
				phone,
				// @ts-expect-error (`Email` não pode ser `undefined`, já foi verificado.)
				email,
				street,
				// @ts-expect-error (`HouseNumber` não pode ser `undefined`, já foi verificado.)
				houseNumber,
				neighborhood: secureNeighborhood,
				// @ts-expect-error (`Complement` não pode ser `undefined`, já foi verificado.)
				complement,
				cep: secureCEP,
				state: secureState,
				city: secureCity,
				role: "student",
			},
		},
		password
	);

	if (userCreation.isError || userCreation.errorCode) {
		if (userCreation.errorCode === 400) {
			return {
				formError: {
					label: t("register.emailAlreadyExists"),
					variant: "alert",
				},
			};
		}

		return {
			formError: {
				label: t("register.failed"),
				variant: "error",
			},
		};
	}

	return { completed: true };
}
