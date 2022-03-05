import React from "react";
import { useCatch, useLoaderData } from "remix";
import type { MetaFunction, LoaderFunction } from "remix";
import { ErrorDisplay } from "~/components/layout/ErrorDisplay";
import { ExamLayout } from "~/components/layout/ExamLayout";
import { searchExams } from "~/helpers/search.server";
import type { ISearchExamsResult } from "~/helpers/search.server";

export const meta: MetaFunction = () => {
	const title = "Exames em andamento - IFAL";
	const description = "Fique por dentro dos exames em andamento, inscreva-se já!";
	const url = "https://ifal.vercel.app/exames/andamento";

	return {
		title,
		description,
		"og:title": title,
		"og:description": description,
		"og:url": url,
		"twitter:title": title,
		"twitter:description": description,
		"twitter:url": url,
	};
};

export const loader: LoaderFunction = async ({ request }) => {
	const search = await searchExams(request, exam => exam.isOpen);
	return search;
};

export function CatchBoundary() {
	const caught = useCatch();

	switch (caught.status) {
		case 404:
			return <ErrorDisplay title="Exames em andamento" label={caught.data} />;

		case 503:
			return (
				<ErrorDisplay
					title="Exames em andamento"
					label="O servidor está offline. Tente novamente mais tarde."
					variant="error"
				/>
			);

		default:
			return (
				<ErrorDisplay
					title="Exames em andamento"
					label="Houve um erro. Recarregue para tentar novamente."
					variant="error"
				/>
			);
	}
}

export default function Ongoing() {
	const search = useLoaderData<ISearchExamsResult>();

	return <ExamLayout title="Exames em andamento" search={search} />;
}
