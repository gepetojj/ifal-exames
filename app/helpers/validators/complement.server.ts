import validator from "validator";

export interface IComplementValidatorMessages {
	isEmpty: string;
	regex: string;
}

export const complementValidator = (
	complement: string | undefined,
	messages?: IComplementValidatorMessages
): string | undefined => {
	if (typeof complement !== "string") {
		return messages?.isEmpty || "Este campo deve ser preenchido corretamente.";
	}
	if (validator.isEmpty(complement)) {
		return;
	}
	if (!validator.matches(complement, /^(?![\s.]+$)[a-zA-Z\s]*$/)) {
		return messages?.regex || "Este campo deve ter apenas letras, sem acentos.";
	}
	return;
};
