import React from "react";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { MdArrowBack } from "react-icons/md";
import { json, Link, useCatch, useLoaderData } from "remix";
import type { LoaderFunction, MetaFunction, HeadersFunction } from "remix";
import invariant from "tiny-invariant";
import { Alert } from "~/components/data/Alert";
import { Course } from "~/components/data/Course";
import { Document } from "~/components/data/Document";
import { Exam } from "~/components/data/Exam";
import { ErrorDisplay } from "~/components/layout/ErrorDisplay";
import type { Exam as IExam } from "~/entities/Exam";
import { remixI18next } from "~/helpers/i18n.server";
import { ExamsRepo } from "~/repositories/implementations/ExamsRepo.server";

interface LoaderData {
	exam: IExam;
}

export const loader: LoaderFunction = async ({ request, params }): Promise<LoaderData> => {
	invariant(params.id);

	const examsRepo = new ExamsRepo();
	const exam = await examsRepo.findById(params.id);
	const t = await remixI18next.getFixedT(request, "translation");

	if (!exam) throw json(t("exam.errors.notFound"), { status: 404 });
	return { exam };
};

export const headers: HeadersFunction = ({ loaderHeaders }) => {
	return {
		"Cache-Control": loaderHeaders.get("Cache-Control") || "max-age=300, s-maxage=3600",
	};
};

export const meta: MetaFunction = ({ data }: { data: LoaderData }) => {
	const exam: IExam = data?.exam;
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
	const i18n = useTranslation("translation");

	switch (caught.status) {
		case 404:
			return (
				<div className="flex flex-col items-center w-full min-h-screen pt-10">
					<ErrorDisplay title={i18n.t("exam.errors.notFound")} label={caught.data} />
					<div className="flex justify-end items-center w-full max-w-[540px] pt-2 px-2">
						<Link
							to="/exames/andamento"
							className="text-black-minusOne text-sm hover:underline"
						>
							{t("controls.goBack")}
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
							{t("controls.goBack")}
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
				{t("exam.documents.title")}
			</h2>
			<ul className="w-full h-auto">
				{documents?.length ? (
					documents.map(document => (
						<li key={document.id} className="my-1">
							<Document {...document} />
						</li>
					))
				) : (
					<Alert label={t("exam.errors.noDocuments")} />
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
						<span className="sr-only">{t("backToPrevious")}</span>
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
						{exam?.name ? t("exam.title") : t("exam.errors.notFound")}
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
							{t("exam.courses.title")}
						</h2>
						<ul className="w-full h-auto">
							{exam.courses ? (
								exam.courses.map(course => (
									<li key={course.id} className="my-2">
										<Course {...course} />
									</li>
								))
							) : (
								<Alert label={t("exam.errors.noCourses")} />
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
