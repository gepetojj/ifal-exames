import validator from "validator";

export interface IEmailValidatorMessages {
	isEmpty: string;
	isEmail: string;
	equals: string;
}

export const emailValidator = (
	email: string | undefined,
	emailToCompare?: string | undefined,
	messages?: IEmailValidatorMessages
): string | undefined => {
	if (typeof email !== "string") {
		return messages?.isEmpty || "Este campo deve ser preenchido.";
	}
	if (validator.isEmpty(email)) {
		return messages?.isEmpty || "Este campo deve ser preenchido.";
	}
	if (!validator.isEmail(email)) {
		return messages?.isEmail || "Este campo deve ser um email válido.";
	}
	if (emailToCompare) {
		if (!validator.equals(email, emailToCompare)) {
			return messages?.equals || "Ambos os emails devem ser iguais.";
		}
	}
	return;
};
