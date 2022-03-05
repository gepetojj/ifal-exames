import React from "react";
import { useCatch, useLoaderData } from "remix";
import type { MetaFunction, LoaderFunction } from "remix";
import { ErrorDisplay } from "~/components/layout/ErrorDisplay";
import { ExamLayout } from "~/components/layout/ExamLayout";
import { ISearchExamsResult, searchExams } from "~/helpers/search.server";

export const meta: MetaFunction = () => {
	const title = "Exames encerrados - IFAL";
	const description = "Verifique os exames que foram encerrados.";
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
	const search = await searchExams(request, exam => exam.isClosed);
	return search;
};

export function CatchBoundary() {
	const caught = useCatch();

	switch (caught.status) {
		case 404:
			return <ErrorDisplay title="Exames encerrados" label={caught.data} />;

		case 503:
			return (
				<ErrorDisplay
					title="Exames encerrados"
					label="O servidor está offline. Tente novamente mais tarde."
					variant="error"
				/>
			);

		default:
			return (
				<ErrorDisplay
					title="Exames encerrados"
					label="Houve um erro. Recarregue para tentar novamente."
					variant="error"
				/>
			);
	}
}

export default function Closed() {
	const search = useLoaderData<ISearchExamsResult>();

	return <ExamLayout title="Exames encerrados" search={search} />;
}
