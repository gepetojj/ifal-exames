import validator from "validator";

export interface IBirthDayValidatorMessages {
	isEmpty: string;
	length: string;
	regex: string;
}

export const birthDayValidator = (
	birthDay: string | undefined,
	messages?: IBirthDayValidatorMessages
): string | undefined => {
	if (typeof birthDay !== "string") {
		return messages?.isEmpty || "Este campo deve ser preenchido.";
	}
	if (validator.isEmpty(birthDay)) {
		return messages?.isEmpty || "Este campo deve ser preenchido.";
	}
	if (!validator.isLength(birthDay, { min: 10, max: 10 })) {
		return messages?.length || "Este campo deve ter 8 números.";
	}
	if (!validator.matches(birthDay, /^\d{2}[/]\d{2}[/]\d{4}$/)) {
		return messages?.regex || "Este campo deve ter apenas números.";
	}
	return;
};
