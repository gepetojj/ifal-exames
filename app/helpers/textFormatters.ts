export const formatTimestamp = (timestamp: number, locale?: "br" | "en"): string => {
	const date = new Date(timestamp * 1000);
	const day = date.getUTCDate() < 10 ? `0${date.getUTCDate()}` : date.getUTCDate().toString();
	const month =
		date.getUTCMonth() + 1 < 10
			? `0${date.getUTCMonth() + 1}`
			: (date.getUTCMonth() + 1).toString();

	if (locale === "br") return `${day}/${month}/${date.getUTCFullYear()}`;
	return `${month}/${day}/${date.getUTCFullYear()}`;
};

export const formatDate = (date?: string): number => {
	const timestamp = Date.parse(date || new Date().toDateString()) / 1000;
	return timestamp;
};

export const formatArray = (array: string[]): string => {
	if (array.length <= 1) return array[0] || "";
	let result = "";
	for (let index = 0; index < array.length; index++) {
		const word = array[index];
		if (!index) result = word;
		else if (index > 0 && index < array.length - 1) result = `${result}, ${word}`;
		else result = `${result} e ${word}`;
	}
	return result;
};
