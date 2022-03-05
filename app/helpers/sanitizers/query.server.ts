import validator from "validator";

export const querySanitizer = (query: string): string => {
	let sanitizedQuery = validator.escape(query);
	sanitizedQuery = validator.trim(sanitizedQuery);

	return sanitizedQuery;
};
