import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import type { FC, ReactNode } from "react";
import { BsQuestionCircle } from "react-icons/bs";

export interface IPopoverProps {
	title: string;
	content: ReactNode;
}

/**
 * Retorna um popover (é aberto quando clicado; mostra informações relevantes).
 *
 * @see {@link IPopoverProps}
 *
 * @param {string} title Título do popover. Será exibido ao ficar com o mouse em cima (hover). Exemplo: `Como se inscrever em um exame?`
 * @param {ReactNode} content Conteúdo do popover. Será exibido ao clicar no popover. Exemplo: `<p>Clique no botão 'Inscrever-se'</p>`
 */
const PopoverComponent: FC<IPopoverProps> = ({ title, content }) => {
	const [isOpen, setIsOpen] = useState(false);
	const popoverRef = useRef<HTMLDivElement>(null);

	const toggleVisibility = useCallback(() => {
		setIsOpen(isOpen => !isOpen);
	}, []);

	useEffect(() => {
		const clickAwayListener = ({ target }: MouseEvent) => {
			if (popoverRef.current && !popoverRef.current.contains(target as Node | null)) {
				setIsOpen(false);
			}
		};
		document.addEventListener("mousedown", clickAwayListener);
		return () => document.removeEventListener("mousedown", clickAwayListener);
	}, []);

	return (
		<div className="flex items-center relative print:hidden" ref={popoverRef}>
			<button title={title} className="px-2" onClick={toggleVisibility}>
				<BsQuestionCircle className="text-sm" />
			</button>
			<div
				className={`flex absolute w-auto h-auto p-2 bg-white-minusTwo border
					border-white-main/20 rounded-project shadow transform origin-bottom-right
					bottom-7 right-1 duration-100 ease-linear z-10 ${isOpen ? "scale-100" : "scale-0"}`}
			>
				{content}
			</div>
		</div>
	);
};
export const Popover = memo(PopoverComponent);
