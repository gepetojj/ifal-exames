import React, { memo } from "react";
import type { FC } from "react";
import { useAuth } from "~/components/context/AuthContext";
import { Button } from "~/components/input/Button";
import type { Exam as IExam } from "~/entities/Exam";
import { formatArray, formatTimestamp } from "~/helpers/textFormatters";

import { Popover } from "../Popover";
import { Tag } from "../Tag";
import type { ITagProps } from "../Tag";

export interface IExamProps extends IExam {
	isExposing?: boolean;
}

/**
 * Retorna os dados de um exame.
 *
 * @see {@link IExamProps}
 *
 * @param {IExam} exam Dados do exame. Este parâmetro deve ser desestruturado ao passar para este componente.
 * @param {boolean} isExposing (Opcional) Quando ativado, remove todos os botões do exame, menos o de se inscrever.
 */
const ExamComponent: FC<IExamProps> = ({ isExposing, ...props }) => {
	const { isLogged } = useAuth();

	return (
		<>
			<h2 className="font-bold text-xl mb-2">{props.name}</h2>
			{Boolean(props.tags) && (
				<div className="flex items-center w-full h-auto pb-2">
					{props.tags.map(tag => (
						<div key={tag.label} className="pr-1">
							<Tag label={tag.label} variant={tag.color as ITagProps["variant"]} />
						</div>
					))}
				</div>
			)}
			<div className="flex flex-col mb-2">
				{Boolean(props.subscriptionPeriod.startsAt) && (
					<span className="text-sm break-words">
						Período de inscrição:{" "}
						<strong>
							{props.isFuture
								? `abre em ${formatTimestamp(props.subscriptionPeriod.startsAt)}`
								: `${formatTimestamp(
										props.subscriptionPeriod.startsAt
								  )} até ${formatTimestamp(props.subscriptionPeriod.endsAt)}`}
						</strong>
					</span>
				)}
				{Boolean(props.campi.length) && (
					<span className="text-sm break-words">
						Campi: <strong>{formatArray(props.campi)}</strong>
					</span>
				)}
				{Boolean(props.offers.length) && (
					<span className="text-sm break-words">
						Ofertas: <strong>{formatArray(props.offers)}</strong>
					</span>
				)}
				{Boolean(props.level) && (
					<span className="text-sm break-words">
						Nível: <strong>{props.level}</strong>
					</span>
				)}
				{Boolean(props.modality) && (
					<span className="flex items-center text-sm break-words">
						Modalidade:&nbsp;<strong>{props.modality}</strong>
						<Popover
							title="O que isto significa?"
							content={
								<>
									<p className="text-xs break-words">
										<strong>Integrado:</strong> para quem concluiu o ensino
										fundamental.
									</p>
									<p className="text-xs break-words pl-2">
										<strong>Subsequente:</strong> para quem concluiu o ensino
										médio.
									</p>
								</>
							}
						/>
					</span>
				)}
				{Boolean(props.vacancies) && (
					<span className="text-sm break-words">
						Vagas disponíveis: <strong>{props.vacancies}</strong>
					</span>
				)}
			</div>
			{props.isOpen ? (
				<div className="flex justify-end items-center w-full h-auto print:hidden">
					{!isExposing && (
						<Button label="Ver mais" variant="blue" href={`/exames/${props.id}`} />
					)}
					<div className="pl-2">
						<Button
							label="Inscrever-se"
							href={isLogged ? undefined : `/auth/login?continue=/exames/${props.id}`}
						/>
					</div>
				</div>
			) : props.isClosed && !isExposing ? (
				<div className="flex justify-end items-center w-full h-auto print:hidden">
					<Button label="Ver mais" variant="blue" href={`/exames/${props.id}`} />
				</div>
			) : null}
		</>
	);
};
export const Exam = memo(ExamComponent);
