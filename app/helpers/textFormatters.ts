export const formatTimestamp = (timestamp: number, locale?: string): string => {
	const date = new Date(timestamp * 1000);
	const formattedDate = date.toLocaleDateString(locale, {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	});
	return formattedDate;
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
