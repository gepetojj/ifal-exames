import React, { memo } from "react";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import type { ICourse } from "~/entities/Exam";

/**
 * Retorna os dados de um curso ofertado por um exame.
 * Os dados geralmente vêm diretamente do banco de dados, mas lógicas extra também funcionam.
 *
 * @see {@link ICourse}
 *
 * @param {string} id Id do curso. Pode ser o Id do objeto no banco de dados, ou alguma lógica extra pode ser implementada
 * @param {string} name Nome do curso. Exemplo: `Técnico em Eletroeletrônica`
 * @param {string} campus Cidade de qual campus está ofertando o curso. Exemplo: `Arapiraca`
 * @param {string} modality Modalidade do curso. Exemplo: `integrated`
 * @param {string} shift Período do curso. Exemplo: `morning`
 * @param {number} vacancies Vagas do curso. Exemplo: `100`
 */
const CourseComponent: FC<ICourse> = ({ name, campus, modality, shift, vacancies }) => {
	const { t } = useTranslation("common");
	const i18n = useTranslation("translation");

	return (
		<div
			className="flex flex-col w-full h-auto bg-white-minusOne rounded-project 
			shadow-sm px-5 py-3 duration-200"
		>
			<span className="text-sm truncate">
				{i18n.t("course.campus")} <strong>{campus}</strong>
			</span>
			<span className="text-sm truncate">
				{i18n.t("course.modality")} <strong>{t(`modalities.${modality}`)}</strong>
			</span>
			<span className="text-sm truncate">
				{i18n.t("course.name")} <strong>{name}</strong>
			</span>
			<span className="text-sm truncate">
				{i18n.t("course.shift")} <strong>{t(`shifts.${shift}`)}</strong>
			</span>
			<span className="text-sm truncate">
				{i18n.t("course.vacancies")} <strong>{vacancies}</strong>
			</span>
		</div>
	);
};

export const Course = memo(CourseComponent);
