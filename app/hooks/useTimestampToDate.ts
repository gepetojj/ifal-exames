import { useEffect, useState } from "react";

export function useTimestampToDate(timestamp: number, locale?: string): string {
	const [date, setDate] = useState("");

	useEffect(() => {
		const timestampToDate = new Date(timestamp);
		setDate(
			timestampToDate.toLocaleDateString(locale, {
				day: "2-digit",
				month: "2-digit",
				year: "numeric",
			})
		);
	}, [timestamp, locale]);

	return date;
}
