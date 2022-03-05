import React, { memo, useCallback, useState } from "react";
import type { FC, ReactNode } from "react";
import { MdArrowDropUp } from "react-icons/md";

export interface IDropdownProps {
	title: string | ReactNode;
	content: string | ReactNode;
}

/**
 * Cria um dropdown (menu que se extende, geralmente para baixo). Este é especificamente usado para perguntas do SAC.
 *
 * @see {@link IDropdownProps}
 *
 * @param {string | ReactNode} title Título do dropdown. Exemplo: `O que faço se esqueci a senha da minha conta?`
 * @param {string | ReactNode} content Conteúdo do dropdown. Exemplo: `Vá até a página login e clique em 'esqueceu sua senha?' ...`
 */
const DropdownComponent: FC<IDropdownProps> = ({ title, content }) => {
	const [isOpen, setIsOpen] = useState(false);

	const toggleVisibility = useCallback(() => {
		setIsOpen(isOpen => !isOpen);
	}, []);

	return (
		<div className="flex flex-col w-full h-auto duration-200 hover:brightness-95">
			<button
				onClick={toggleVisibility}
				className="flex justify-between items-center w-full h-fit bg-white-minusOne px-3 py-2 rounded-project
				shadow-sm"
			>
				<span className="text-lg text-left font-medium max-w-[93%] break-words">
					{title}
				</span>
				<div className="flex justify-center items-center w-10 h-full">
					<MdArrowDropUp
						className={`text-3xl ${isOpen ? "rotate-0" : "rotate-180"} duration-200`}
					/>
				</div>
			</button>
			<div
				className={`justify-center items-center transform duration-100 origin-top ease-in-out p-3 
				bg-white-minusOne/40 ${isOpen ? "flex" : "hidden"}`}
			>
				<p className="w-full h-full text-justify break-words">{content}</p>
			</div>
		</div>
	);
};
export const Dropdown = memo(DropdownComponent);
