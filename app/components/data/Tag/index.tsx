import React, { memo } from "react";
import type { FC } from "react";
import { MdClose } from "react-icons/md";

export interface ITagProps {
	label: string;
	variant?: "red" | "green" | "blue" | "yellow";
	onClose?: () => void;
}

/**
 * Retorna uma tag. Este componente é usado em exames.
 *
 * @see {@link ITagProps}
 *
 * @param {string} label Texto da tag. Exemplo: `Gratuito`
 * @param {ITagProps["variant"]} variant (Opcional; O padrão é ´green´) Cor da tag. Pode ser `red`, `green`, `blue` ou `yellow`
 * @param {void} onClose (Opcional) Função que será executada quando o usuário fechar a tag. Se esta função existir, tranforma a tag em um botão
 */
const TagComponent: FC<ITagProps> = ({ label, variant, onClose }) => {
	return (
		<button
			className={`flex justify-center items-center w-[4.5rem] h-auto px-2 py-[2px] 
			select-none rounded-project ${
				variant === "red"
					? "bg-alt-red"
					: variant === "blue"
					? "bg-alt-blue"
					: variant === "yellow"
					? "bg-alt-yellow"
					: "bg-primary-main"
			}`}
			onClick={onClose}
		>
			<span
				className={`text-sm truncate ${
					variant === "yellow" ? "text-black-plusOne" : "text-white-minusOne"
				} print:text-black-main`}
			>
				{label}
			</span>
			{onClose && <MdClose className="text-xl" />}
		</button>
	);
};
export const Tag = memo(TagComponent);
