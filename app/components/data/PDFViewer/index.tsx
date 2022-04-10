import { Dialog } from "@headlessui/react";

import React, { memo, useCallback, useState } from "react";
import type { FC, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { MdClear, MdFileDownload, MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import { Page, Document, pdfjs } from "react-pdf";

import { Alert } from "../Alert";

export interface IPDFViewerProps {
	isOpen: boolean;
	link: string;

	onClose: (newState: boolean) => void;
}

/**
 * Retorna um visualizador de PDF.
 *
 * @see {@link IPDFViewerProps}
 *
 * @param {boolean} isOpen Determina se o visualizador deve estar visível.
 * @param {string} link Determina o endereço web onde o PDF se encontra. Provavelmente provido pelo Firebase Storage.
 * @param {(newState: boolean) => void} onClose Callback executado quando o usuário pede para fechar o visualizador.
 */
const PDFViewerComponent: FC<IPDFViewerProps> = ({ isOpen, link, onClose }) => {
	const [pages, setPages] = useState(0);
	const [page, setPage] = useState(0);
	const { t } = useTranslation("translation");

	pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;

	const onPDFLoading = useCallback((): ReactElement => {
		return <Alert label={t("pdf.loading")} variant="info" />;
	}, [t]);

	const onPDFLoad = useCallback(({ numPages }: { numPages: number }) => {
		setPages(numPages);
	}, []);

	const onPDFError = useCallback((): ReactElement => {
		return <Alert label={t("pdf.errors.loading")} />;
	}, [t]);

	const previousPage = useCallback(() => {
		if (page - 1 < 0) return;
		setPage(page - 1);
	}, [page, setPage]);

	const nextPage = useCallback(() => {
		if (page + 1 >= pages) return;
		setPage(page + 1);
	}, [page, pages, setPage]);

	return (
		<Dialog
			open={isOpen}
			onClose={onClose}
			className="flex flex-col fixed inset-0 w-full h-full bg-black-main/40 overflow-y-auto"
		>
			<button
				className="fixed right-10 top-10 p-1 bg-white-minusOne/70 shadow rounded-project z-10
				duration-200 hover:brightness-90"
				onClick={() => onClose(false)}
			>
				<span className="sr-only">{t("pdf.controls.close")}</span>
				<MdClear className="text-2xl text-black-plusOne" />
			</button>
			{pages > 0 && (
				<a
					href={link}
					target="_blank"
					rel="noreferrer"
					download
					className="fixed right-10 top-20 p-1 bg-white-minusOne/70 shadow rounded-project z-10 duration-200 hover:brightness-90"
				>
					<span className="sr-only">{t("pdf.controls.download")}</span>
					<MdFileDownload className="text-2xl text-black-plusOne" />
				</a>
			)}
			<Document
				className="flex justify-center items-center flex-col w-full h-full p-4"
				file={link}
				renderMode="svg"
				externalLinkTarget="_blank"
				options={{
					cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
					cMapPacked: true,
				}}
				onLoadSuccess={onPDFLoad}
				error={onPDFError}
				loading={onPDFLoading}
			>
				<Page
					className="flex flex-col justify-center items-center"
					pageIndex={page}
					renderAnnotationLayer={false}
				/>
				{pages > 0 && (
					<div className="flex fixed bottom-10 justify-between items-center w-full max-w-[40rem] h-auto px-4">
						<button
							className="p-1 bg-black-plusOne/50 shadow rounded-project z-10 duration-200 hover:brightness-90
						disabled:cursor-not-allowed"
							onClick={previousPage}
							disabled={page <= 0}
						>
							<span className="sr-only">{t("pdf.controls.goBack")}</span>
							<MdNavigateBefore className="text-2xl text-white-minusOne" />
						</button>
						<span className="px-2 py-1 text-white-minusOne bg-black-plusOne/30 rounded-project">
							{t("pdf.page", { page: page + 1, pages })}
						</span>
						<button
							className="p-1 bg-black-plusOne/50 shadow rounded-project z-10 duration-200 hover:brightness-90
						disabled:cursor-not-allowed"
							onClick={nextPage}
							disabled={page + 1 >= pages}
						>
							<span className="sr-only">{t("pdf.controls.goNext")}</span>
							<MdNavigateNext className="text-2xl text-white-minusOne" />
						</button>
					</div>
				)}
			</Document>
		</Dialog>
	);
};

export const PDFViewer = memo(PDFViewerComponent);
