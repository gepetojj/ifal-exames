import React, { memo, useCallback, useState } from "react";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { PDFViewer } from "~/components/data/PDFViewer";
import type { IDocument } from "~/entities/Exam";
import { useTimestampToDate } from "~/hooks/useTimestampToDate";

/**
 * Retorna os dados de um documento de um exame.
 * Os dados geralmente vêm diretamente do banco de dados, mas lógicas extra também funcionam.
 *
 * @see {@link IDocument}
 *
 * @param {string} name Nome do documento. Exemplo: `Edital ...`
 * @param {string} link Link do documento. Exemplo: link do documento guardado no storage.
 * @param {number} createdAt Timestamp (unix epoch) da data de criação do documento. Exemplo: `1635724800` (01/11/2021 00:00:00 GMT)
 * @param {number} updatedAt Timestamp (unix epoch) da data de atualização do documento. Exemplo: `1635724800` (01/11/2021 00:00:00 GMT)
 */
const DocumentComponent: FC<IDocument> = ({ name, link, createdAt, updatedAt }) => {
	const { t, i18n } = useTranslation("translation");

	const [isPDFOpen, setIsPDFOpen] = useState(false);

	const createdAtString = useTimestampToDate(createdAt, i18n.language);
	const updatedAtString = useTimestampToDate(updatedAt, i18n.language);

	const openPDFViewer = useCallback(() => {
		setIsPDFOpen(true);
	}, []);

	return (
		<>
			<PDFViewer isOpen={isPDFOpen} link={link} onClose={setIsPDFOpen} />
			<button
				title={name}
				className={`flex flex-col w-full h-auto rounded-project shadow-sm select-none 
				px-5 py-3 cursor-pointer duration-200 hover:brightness-95
				${isPDFOpen ? "bg-white-minusTwo" : "bg-white-minusOne"}`}
				onClick={openPDFViewer}
				tabIndex={0}
			>
				<h3 className="font-bold text-base truncate">{name}</h3>
				{createdAt > 0 && (
					<span className="text-sm truncate">
						{t("exam.documents.createdAt", { date: createdAtString })}
					</span>
				)}
				{updatedAt > 0 && (
					<span className="text-sm truncate">
						{t("exam.documents.updatedAt", { date: updatedAtString })}
					</span>
				)}
			</button>
		</>
	);
};

export const Document = memo(DocumentComponent);
