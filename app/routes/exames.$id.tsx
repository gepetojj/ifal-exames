import React from "react";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { MdArrowBack } from "react-icons/md";
import { json, Link, useCatch, useLoaderData } from "remix";
import type { LoaderFunction, MetaFunction } from "remix";
import type { Language } from "remix-i18next";
import invariant from "tiny-invariant";
import { Alert } from "~/components/data/Alert";
import { Course } from "~/components/data/Course";
import { Document } from "~/components/data/Document";
import { Exam } from "~/components/data/Exam";
import { ErrorDisplay } from "~/components/layout/ErrorDisplay";
import type { Exam as IExam } from "~/entities/Exam";
import { getExam } from "~/helpers/api/exams.server";
import { remixI18next } from "~/helpers/i18n.server";

interface LoaderData {
	exam: IExam;
	i18n: Record<string, Language>;
}

export const loader: LoaderFunction = async ({ request, params }): Promise<LoaderData> => {
	invariant(params.id, "Informe o ID do exame.");
	const { isError, errorCode, data } = await getExam(params.id);
	const t = await remixI18next.getFixedT(request, "translation");

	if (isError || !data)
		throw json(t("examDetails.examNotFound"), {
			status: errorCode === 204 ? 404 : errorCode || 404,
		});

	return {
		exam: data,
		i18n: await remixI18next.getTranslations(request, ["common", "translation"]),
	};
};

export const meta: MetaFunction = ({ data }) => {
	const exam: IExam = data.exam;
	const title = exam?.id ? `${exam.name} - IFAL` : `Exame não encontrado - IFAL`;
	const description = exam?.id
		? `${exam.name} ${
				exam.isOpen
					? "está em andamento."
					: exam.isClosed
					? "foi encerrado."
					: "ainda vai abrir."
		  }.`
		: `Este exame não foi encontrado.`;
	const url = exam?.id
		? `https://ifal.vercel.app/exames/${exam.id}`
		: `https://ifal.vercel.app/exames/andamento`;

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

export function CatchBoundary() {
	const caught = useCatch();
	const { t } = useTranslation("common");

	switch (caught.status) {
		case 404:
			return (
				<div className="flex flex-col items-center w-full min-h-screen pt-10">
					<ErrorDisplay title={t("examDetails.examNotFound")} label={caught.data} />
					<div className="flex justify-end items-center w-full max-w-[540px] pt-2 px-2">
						<Link
							to="/exames/andamento"
							className="text-black-minusOne text-sm hover:underline"
						>
							{t("goBack")}
						</Link>
					</div>
				</div>
			);

		case 503:
			return (
				<div className="flex flex-col items-center w-full min-h-screen pt-10">
					<ErrorDisplay
						title={t("error.error")}
						label="O servidor está offline. Tente novamente mais tarde."
						variant="error"
					/>
					<div className="flex justify-end items-center w-full max-w-[540px] pt-2 px-2">
						<Link
							to="/exames/andamento"
							className="text-black-minusOne text-sm hover:underline"
						>
							{t("goBack")}
						</Link>
					</div>
				</div>
			);

		default:
			return (
				<div className="flex flex-col items-center w-full min-w-screen pt-10">
					<ErrorDisplay
						title={t("error.error")}
						label={t("error.unexpected")}
						variant="error"
					/>
					<div className="flex justify-end items-center w-full max-w-[540px] pt-2 px-2">
						<Link
							to="/exames/andamento"
							className="text-black-minusOne text-sm hover:underline"
						>
							{t("goBack")}
						</Link>
					</div>
				</div>
			);
	}
}

const Documents: FC<IExam> = ({ documents }) => {
	const { t } = useTranslation("translation");

	return (
		<>
			<h2 className="text-black-plusOne font-medium text-xl mb-2">
				{t("document.documents")}
			</h2>
			<ul className="w-full h-auto">
				{documents?.length ? (
					documents.map(document => (
						<li key={document.id} className="my-1">
							<Document {...document} />
						</li>
					))
				) : (
					<Alert label={t("document.notFound")} />
				)}
			</ul>
		</>
	);
};

export default function ExamDetails() {
	const { exam } = useLoaderData<LoaderData>();
	const { t } = useTranslation("translation");

	return (
		<main
			className="flex flex-col tablet:items-center md:grid md:grid-cols-layout 
			md:gap-28 w-screen h-full min-h-screen bg-white-main text-black-main px-4 py-7 md:py-10"
		>
			<aside className="flex justify-end items-start w-full h-full">
				<div className="flex md:flex-col justify-start items-center md:items-start w-full h-auto md:max-w-[300px] print:hidden">
					<Link
						to="/exames"
						prefetch="intent"
						className="flex justify-center items-center w-fit p-1 bg-white-minusOne rounded-project shadow-sm"
					>
						<span className="sr-only">Clique aqui para voltar à página anterior</span>
						<MdArrowBack className="text-3xl text-black-plusOne" />
					</Link>
					{exam && (
						<div className="hidden md:flex flex-col w-full h-fit mt-4">
							<Documents {...exam} />
						</div>
					)}
				</div>
			</aside>
			<div className="flex flex-col justify-start items-center md:items-start w-full md:max-w-[540px] h-full mt-3 md:mt-0">
				<div className="w-full mb-3">
					<h1 className="text-center md:text-left font-medium text-3xl truncate">
						{exam?.name ? "Detalhes do exame" : t("examDetails.examNotFound")}
					</h1>
				</div>
				{exam && (
					<div
						about="exam"
						className="flex flex-col w-full h-auto bg-white-minusOne rounded-project p-5 my-4 shadow-sm"
					>
						<Exam {...exam} isExposing />
					</div>
				)}
				{exam && (
					<div className="flex flex-col w-full h-fit">
						<h2 className="text-black-plusOne font-medium text-xl mb-2">
							{t("examDetails.courses")}
						</h2>
						<ul className="w-full h-auto">
							{exam.courses ? (
								exam.courses.map(course => (
									<li key={course.id} className="my-2">
										<Course {...course} />
									</li>
								))
							) : (
								<Alert label={t("examDetails.noCourses")} />
							)}
						</ul>
					</div>
				)}
				{exam && (
					<div className="flex flex-col w-full h-fit mt-2 md:hidden">
						<Documents {...exam} />
					</div>
				)}
			</div>
		</main>
	);
}
