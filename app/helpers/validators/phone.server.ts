import validator from "validator";

export interface IPhoneValidatorMessages {
	isEmpty: string;
	length: string;
	regex: string;
}

export const phoneValidator = (
	phone: string | undefined,
	messages?: IPhoneValidatorMessages
): string | undefined => {
	if (typeof phone !== "string") {
		return messages?.isEmpty || "Este campo deve ser preenchido.";
	}
	if (validator.isEmpty(phone)) {
		return messages?.isEmpty || "Este campo deve ser preenchido.";
	}
	if (!validator.isLength(phone, { min: 13, max: 13 })) {
		return messages?.length || "Este campo deve ter 11 números.";
	}
	if (!validator.matches(phone, /^\d{2}\s\d{5}[-]\d{4}$/)) {
		return messages?.regex || "Este campo deve ter apenas números.";
	}
	return;
};
