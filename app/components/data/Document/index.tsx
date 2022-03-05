import React, { memo } from "react";
import type { FC } from "react";
import type { IDocument } from "~/entities/Exam";
import { formatTimestamp } from "~/helpers/textFormatters";

/**
 * Retorna os dados de um documento de um exame.
 * Os dados geralmente vêm diretamente do banco de dados, mas lógicas extra também funcionam.
 *
 * @see {@link IDocument}
 *
 * @param {string} name Nome do documento. Exemplo: `Edital ...`
 * @param {number} createdAt Timestamp (unix epoch) da data de criação do documento. Exemplo: `1635724800` (01/11/2021 00:00:00 GMT)
 * @param {number} updatedAt Timestamp (unix epoch) da data de atualização do documento. Exemplo: `1635724800` (01/11/2021 00:00:00 GMT)
 */
const DocumentComponent: FC<IDocument> = ({ name, createdAt, updatedAt }) => {
	return (
		<div
			title={name}
			role="button"
			className="flex flex-col w-full h-auto bg-white-minusOne rounded-project 
			shadow-sm select-none px-5 py-3 cursor-pointer duration-200 hover:brightness-95"
		>
			<h3 className="font-bold text-base truncate">{name}</h3>
			{createdAt > 0 && (
				<span className="text-sm truncate">Criado em: {formatTimestamp(createdAt)}</span>
			)}
			{updatedAt > 0 && (
				<span className="text-sm truncate">
					Atualizado em: {formatTimestamp(updatedAt)}
				</span>
			)}
		</div>
	);
};
export const Document = memo(DocumentComponent);
