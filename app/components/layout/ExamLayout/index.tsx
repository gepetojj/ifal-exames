import React, { memo, useState } from "react";
import type { FC } from "react";
import { Form } from "remix";
import { Alert } from "~/components/data/Alert";
import { Exam } from "~/components/data/Exam";
import { Searchbar } from "~/components/input/Searchbar";
import { ISearchExamsResult } from "~/helpers/search.server";

export interface IExamLayoutProps {
	title: string;
	search: ISearchExamsResult;
}

const ExamLayoutComponent: FC<IExamLayoutProps> = ({ title, search }) => {
	const [searchValue, setSearchValue] = useState(search.query);

	return (
		<div className="flex flex-col justify-start items-center md:items-start w-full max-w-[540px] h-full p-2 pt-0 mt-3 md:mt-0">
			<div className="w-full h-auto mb-1">
				<h2 className="text-black-plusOne font-medium text-3xl text-center md:text-left w-full h-12 max-w-full truncate">
					{title}
				</h2>
			</div>
			<div className="w-full h-full">
				<Form method="get">
					<Searchbar value={searchValue} handler={setSearchValue} />
				</Form>
				{search.filteredExams.length ? (
					<>
						{search.query.length > 0 && (
							<div className="w-full text-right pt-2">
								<span className="text-sm italic">
									Mostrando {search.filteredExams.length} resultado(s) de{" "}
									{search.exams.length} devido à sua pesquisa.
								</span>
							</div>
						)}
						<ul className="w-full h-full">
							{search.filteredExams.map(exam => (
								<li
									about="exam"
									key={exam.item.id}
									className="flex flex-col w-full h-auto bg-white-minusOne rounded-project p-5 my-4 shadow-sm"
								>
									<Exam {...exam.item} />
								</li>
							))}
						</ul>
					</>
				) : search.exams.length ? (
					<>
						{search.query.length > 0 && (
							<div className="pt-2">
								<Alert label="Sua pesquisa não encontrou resultados." />
							</div>
						)}
						<ul className="w-full h-full">
							{search.exams.map(exam => (
								<li
									about="exam"
									key={exam.id}
									className="flex flex-col w-full h-auto bg-white-minusOne rounded-project p-5 my-4 shadow-sm"
								>
									<Exam {...exam} />
								</li>
							))}
						</ul>
					</>
				) : (
					<Alert label="Não há exames disponíveis agora." variant="error" />
				)}
			</div>
		</div>
	);
};
export const ExamLayout = memo(ExamLayoutComponent);