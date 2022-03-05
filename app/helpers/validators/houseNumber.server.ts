import validator from "validator";

export interface IHouseNumberValidatorMessages {
	isEmpty: string;
	length: string;
	regex: string;
}

export const houseNumberValidator = (
	houseNumber: string | undefined,
	messages?: IHouseNumberValidatorMessages
): string | undefined => {
	if (typeof houseNumber !== "string") {
		return messages?.isEmpty || "Este campo deve ser preenchido.";
	}
	if (validator.isEmpty(houseNumber)) {
		return messages?.isEmpty || "Este campo deve ser preenchido.";
	}
	if (!validator.isLength(houseNumber, { min: 1, max: 10 })) {
		return messages?.length || "Este campo deve ter até 10 números.";
	}
	if (!validator.matches(houseNumber, /^\d{1,10}$/)) {
		return messages?.regex || "Este campo deve ter apenas números.";
	}
	return;
};
