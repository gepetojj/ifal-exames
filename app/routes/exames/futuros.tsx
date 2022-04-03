import React from "react";
import { useTranslation } from "react-i18next";
import { MetaFunction, LoaderFunction } from "remix";
import { useLoaderData, useCatch } from "remix";
import { ErrorDisplay } from "~/components/layout/ErrorDisplay";
import { ExamLayout } from "~/components/layout/ExamLayout";
import { ISearchExamsResult, searchExams } from "~/helpers/search.server";
import { ExamsRepo } from "~/repositories/implementations/ExamsRepo.server";

interface LoaderData {
	search: ISearchExamsResult;
}

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

export const loader: LoaderFunction = async ({ request }): Promise<LoaderData> => {
	const examsRepo = new ExamsRepo();
	const search = await searchExams(request, examsRepo.getClosed);
	return { search };
};

export function CatchBoundary() {
	const caught = useCatch();
	const { t } = useTranslation();

	switch (caught.status) {
		case 404:
			return <ErrorDisplay title={t("uppercase.futureExams")} label={caught.data} />;

		case 503:
			return (
				<ErrorDisplay
					title={t("uppercase.futureExams")}
					label="O servidor está offline. Tente novamente mais tarde."
					variant="error"
				/>
			);

		default:
			return (
				<ErrorDisplay
					title={t("uppercase.futureExams")}
					label="Houve um erro. Recarregue para tentar novamente."
					variant="error"
				/>
			);
	}
}

export default function Future() {
	const search = useLoaderData<ISearchExamsResult>();
	const { t } = useTranslation();

	return <ExamLayout title={t("uppercase.futureExams")} search={search} />;
}
