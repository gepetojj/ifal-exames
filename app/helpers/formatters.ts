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
