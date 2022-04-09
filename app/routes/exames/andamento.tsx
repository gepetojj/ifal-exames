import React from "react";
import { useTranslation } from "react-i18next";
import { useCatch, useLoaderData } from "remix";
import type { MetaFunction, LoaderFunction } from "remix";
import { ErrorDisplay } from "~/components/layout/ErrorDisplay";
import { ExamLayout } from "~/components/layout/ExamLayout";
import { searchExams } from "~/helpers/search.server";
import type { ISearchExamsResult } from "~/helpers/search.server";
import { ExamsRepo } from "~/repositories/implementations/ExamsRepo.server";

interface LoaderData {
	search: ISearchExamsResult;
}

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

export const loader: LoaderFunction = async ({ request }): Promise<LoaderData> => {
	const examsRepo = new ExamsRepo();
	const search = await searchExams(request, examsRepo.getOngoing);
	return { search };
};

export function CatchBoundary() {
	const caught = useCatch();
	const { t } = useTranslation("common");

	switch (caught.status) {
		case 404:
			return <ErrorDisplay title={t("uppercase.ongoingExams")} label={caught.data} />;

		default:
			return (
				<ErrorDisplay
					title={t("uppercase.ongoingExams")}
					label={t("error.common")}
					variant="error"
				/>
			);
	}
}

export default function Ongoing() {
	const { search } = useLoaderData<LoaderData>();
	const { t } = useTranslation();

	return <ExamLayout title={t("uppercase.ongoingExams")} search={search} />;
}
