import validator from "validator";

export interface ICPFValidatorMessages {
	isEmpty: string;
	length: string;
	regex: string;
}

export const cpfValidator = (
	cpf: string | undefined,
	messages?: ICPFValidatorMessages
): string | undefined => {
	if (typeof cpf !== "string") {
		return messages?.isEmpty || "Este campo deve ser preenchido.";
	}
	if (validator.isEmpty(cpf)) {
		return messages?.isEmpty || "Este campo deve ser preenchido.";
	}
	if (!validator.isLength(cpf, { min: 14, max: 14 })) {
		return messages?.length || "Este campo deve ter 11 números.";
	}
	if (!validator.matches(cpf, /^\d{3}[.]\d{3}[.]\d{3}[-]\d{2}$/)) {
		return messages?.regex || "Este campo deve ter apenas números.";
	}
	return;
};
