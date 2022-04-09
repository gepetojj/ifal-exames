import React from "react";
import { useTranslation } from "react-i18next";
import { useCatch, useLoaderData } from "remix";
import type { MetaFunction, LoaderFunction } from "remix";
import { ErrorDisplay } from "~/components/layout/ErrorDisplay";
import { ExamLayout } from "~/components/layout/ExamLayout";
import { ISearchExamsResult, searchExams } from "~/helpers/search.server";
import { ExamsRepo } from "~/repositories/implementations/ExamsRepo.server";

interface LoaderData {
	search: ISearchExamsResult;
}

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
			return <ErrorDisplay title={t("uppercase.closedExams")} label={caught.data} />;

		default:
			return (
				<ErrorDisplay
					title={t("uppercase.closedExams")}
					label={t("error.common")}
					variant="error"
				/>
			);
	}
}

export default function Closed() {
	const { search } = useLoaderData<LoaderData>();
	const { t } = useTranslation();

	return <ExamLayout title={t("uppercase.closedExams")} search={search} />;
}
