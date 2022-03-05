import React, { memo, useState } from "react";
import type { FC } from "react";
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
 * @param {string} modality Modalidade do curso. Exemplo: `Integrado`
 * @param {string} shift Período do curso. É alterável no estado `shifts` do componente. Exemplo: `Manhã`
 * @param {number} vacancies Vagas do curso. Exemplo: `100`
 */
const CourseComponent: FC<ICourse> = ({ id, name, campus, modality, shift, vacancies }) => {
	const [shifts] = useState({
		morning: "Manhã",
		afternoon: "Tarde",
		night: "Noite",
	});

	return (
		<div
			className="flex flex-col w-full h-auto bg-white-minusOne rounded-project 
			shadow-sm px-5 py-3 duration-200"
		>
			<span className="text-sm truncate">
				Código: <strong>{id}</strong>
			</span>
			<span className="text-sm truncate">
				Campus: <strong>{campus}</strong>
			</span>
			<span className="text-sm truncate">
				Modalidade: <strong>{modality}</strong>
			</span>
			<span className="text-sm truncate">
				Curso: <strong>{name}</strong>
			</span>
			<span className="text-sm truncate">
				Turno: <strong>{shifts[shift]}</strong>
			</span>
			<span className="text-sm truncate">
				Vagas: <strong>{vacancies}</strong>
			</span>
		</div>
	);
};

export const Course = memo(CourseComponent);
