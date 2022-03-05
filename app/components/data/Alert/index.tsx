import React, { memo } from "react";
import type { FC } from "react";
import { MdReportProblem } from "react-icons/md";

export interface IAlertProps {
	label: string;
	variant?: "alert" | "error" | "info";
}

/**
 * Retorna um alerta, com três variantes: `alert`, `error` e `info`.
 *
 * @see {@link IAlertProps}
 *
 * @param {string} label Texto que será exibido no alerta
 * @param {IAlertProps["variant"]} variant Variante do alerta, podendo ser uma das três
 */
const AlertComponent: FC<IAlertProps> = ({ label, variant = "alert" }) => {
	return (
		<div
			className={`flex justify-center items-center w-full h-auto p-2 ${
				variant === "alert"
					? "bg-alt-yellow text-black-plusOne"
					: variant === "error"
					? "bg-alt-red text-white-minusOne"
					: "bg-alt-blue text-white-minusOne"
			} rounded-project`}
		>
			<div className="flex justify-center items-center w-full max-w-[10%] mr-3">
				<MdReportProblem className="text-xl" />
			</div>
			<div className="flex justify-center items-center w-full max-w-[90%]">
				<span className="max-w-full break-words">{label}</span>
			</div>
		</div>
	);
};
export const Alert = memo(AlertComponent);
