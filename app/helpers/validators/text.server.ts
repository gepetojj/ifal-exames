import validator from "validator";

export interface ITextValidatorMessages {
	isEmpty: string;
	regex: string;
}

export const textValidator = (
	text: string | undefined,
	messages?: ITextValidatorMessages
): string | undefined => {
	if (typeof text !== "string") {
		return messages?.isEmpty || "Este campo deve ser preenchido.";
	}
	if (validator.isEmpty(text)) {
		return messages?.isEmpty || "Este campo deve ser preenchido.";
	}
	if (!validator.matches(text, /^(?![\s.]+$)[a-zA-Z\s]*$/)) {
		return messages?.regex || "Este campo deve ter apenas letras, sem acentos.";
	}
	return;
};
