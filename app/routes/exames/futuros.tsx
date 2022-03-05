import React from "react";
import { MetaFunction, LoaderFunction } from "remix";
import { useLoaderData, useCatch } from "remix";
import { ErrorDisplay } from "~/components/layout/ErrorDisplay";
import { ExamLayout } from "~/components/layout/ExamLayout";
import { ISearchExamsResult, searchExams } from "~/helpers/search.server";

export const meta: MetaFunction = () => {
	const title = "Exames futuros - IFAL";
	const description = "Dê uma olhadinha nos exames que serão abertos.";
	const url = "https://ifal.vercel.app/exames/encerrados";

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
	const search = await searchExams(request, exam => exam.isFuture);
	return search;
};

export function CatchBoundary() {
	const caught = useCatch();

	switch (caught.status) {
		case 404:
			return <ErrorDisplay title="Exames futuros" label={caught.data} />;

		case 503:
			return (
				<ErrorDisplay
					title="Exames futuros"
					label="O servidor está offline. Tente novamente mais tarde."
					variant="error"
				/>
			);

		default:
			return (
				<ErrorDisplay
					title="Exames futuros"
					label="Houve um erro. Recarregue para tentar novamente."
					variant="error"
				/>
			);
	}
}

export default function Future() {
	const search = useLoaderData<ISearchExamsResult>();

	return <ExamLayout title="Exames futuros" search={search} />;
}
