import React, { memo, useState, useEffect, useCallback } from "react";
import type { FC } from "react";
import { MdArrowUpward } from "react-icons/md";

/**
 * Retorna um botão que leva o usuário ao início vertical da página.
 */
const ScrollToTopComponent: FC = () => {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const toggleIsVisible = () => {
			const scrollPosition = document.documentElement.scrollTop;
			if (scrollPosition > 230) setIsVisible(true);
			else setIsVisible(false);
		};

		window.addEventListener("scroll", toggleIsVisible);
		return () => window.removeEventListener("scroll", toggleIsVisible);
	}, []);

	const goToTop = useCallback(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}, []);

	return (
		<button
			className={`flex fixed justify-center items-center 
			bg-white-minusOne shadow rounded-project bottom-10 right-5 p-2 origin-top-right 
			transform duration-200 ${isVisible ? "scale-100" : "scale-0"}`}
			onClick={goToTop}
			type="button"
		>
			<span className="sr-only">Clique aqui para voltar para o topo da página</span>
			<MdArrowUpward className="text-2xl text-black-plusOne" />
		</button>
	);
};
export const ScrollToTop = memo(ScrollToTopComponent);
