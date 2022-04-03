import React from "react";
import { useTranslation } from "react-i18next";
import { useCatch, useLoaderData } from "remix";
import type { MetaFunction, LoaderFunction } from "remix";
import type { Language } from "remix-i18next";
import { ErrorDisplay } from "~/components/layout/ErrorDisplay";
import { ExamLayout } from "~/components/layout/ExamLayout";
import { remixI18next } from "~/helpers/i18n.server";
import { ISearchExamsResult, searchExams } from "~/helpers/search.server";
import { ExamsRepo } from "~/repositories/implementations/ExamsRepo.server";

interface LoaderData {
	search: ISearchExamsResult;
	i18n: Record<string, Language>;
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
	return { search, i18n: await remixI18next.getTranslations(request, "common") };
};

export function CatchBoundary() {
	const caught = useCatch();
	const { t } = useTranslation();

	switch (caught.status) {
		case 404:
			return <ErrorDisplay title={t("uppercase.closedExams")} label={caught.data} />;

		case 503:
			return (
				<ErrorDisplay
					title={t("uppercase.closedExams")}
					label="O servidor está offline. Tente novamente mais tarde."
					variant="error"
				/>
			);

		default:
			return (
				<ErrorDisplay
					title={t("uppercase.closedExams")}
					label="Houve um erro. Recarregue para tentar novamente."
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
