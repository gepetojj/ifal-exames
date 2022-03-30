import React from "react";
import { useTranslation } from "react-i18next";
import { useCatch, useLoaderData } from "remix";
import type { MetaFunction, LoaderFunction } from "remix";
import type { Language } from "remix-i18next";
import { ErrorDisplay } from "~/components/layout/ErrorDisplay";
import { ExamLayout } from "~/components/layout/ExamLayout";
import { remixI18next } from "~/helpers/i18n.server";
import { searchExams } from "~/helpers/search.server";
import type { ISearchExamsResult } from "~/helpers/search.server";

interface LoaderData {
	search: ISearchExamsResult;
	i18n: Record<string, Language>;
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
	const search = await searchExams(request, exam => exam.isOpen);
	return { search, i18n: await remixI18next.getTranslations(request, ["common", "translation"]) };
};

export function CatchBoundary() {
	const caught = useCatch();
	const { t } = useTranslation();

	switch (caught.status) {
		case 404:
			return <ErrorDisplay title={t("uppercase.ongoingExams")} label={caught.data} />;

		case 503:
			return (
				<ErrorDisplay
					title={t("uppercase.ongoingExams")}
					label="O servidor está offline. Tente novamente mais tarde."
					variant="error"
				/>
			);

		default:
			return (
				<ErrorDisplay
					title={t("uppercase.ongoingExams")}
					label="Houve um erro. Recarregue para tentar novamente."
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
