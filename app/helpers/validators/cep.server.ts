import validator from "validator";

export interface ICEPValidatorMessages {
	isEmpty: string;
	length: string;
	regex: string;
}

export const cepValidator = (
	cep: string | undefined,
	messages?: ICEPValidatorMessages
): string | undefined => {
	if (typeof cep !== "string") {
		return messages?.isEmpty || "Este campo deve ser preenchido.";
	}
	if (validator.isEmpty(cep)) {
		return messages?.isEmpty || "Este campo deve ser preenchido.";
	}
	if (!validator.isLength(cep, { min: 10, max: 10 })) {
		return messages?.length || "Este campo deve ter 8 números.";
	}
	if (!validator.matches(cep, /^\d{2}[.]\d{3}[-]\d{3}$/)) {
		return messages?.regex || "Este campo deve ter apenas números.";
	}
	return;
};
