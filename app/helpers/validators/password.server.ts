import validator from "validator";

export interface IPasswordValidatorMessages {
	isEmpty: string;
	length: string;
	isStrong: string;
	equals: string;
}

export const passwordValidator = (
	password: string | undefined,
	passwordToCompare?: string,
	messages?: IPasswordValidatorMessages
): string | undefined => {
	if (typeof password !== "string") {
		return messages?.isEmpty || "Este campo deve ser preenchido.";
	}
	if (validator.isEmpty(password)) {
		return messages?.isEmpty || "Este campo deve ser preenchido.";
	}
	if (!validator.isLength(password, { min: 10, max: 64 })) {
		return messages?.length || "Este campo deve ter entre 10 e 64 caracteres.";
	}
	if (!validator.isStrongPassword(password, { minLength: 10 })) {
		return (
			messages?.isStrong ||
			"A senha deve ter ao menos uma letra maiúscula e minúscula, um número e um caracter especial."
		);
	}
	if (passwordToCompare) {
		if (!validator.equals(password, passwordToCompare)) {
			return messages?.equals || "Ambas as senhas devem ser iguais.";
		}
	}
	return;
};
