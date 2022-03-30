import React, { memo, useCallback } from "react";
import type { HTMLProps, Dispatch, SetStateAction, ChangeEvent } from "react";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { MdSearch, MdSearchOff } from "react-icons/md";

export interface ISearchbarProps extends HTMLProps<HTMLInputElement> {
	value: string;
	handler: Dispatch<SetStateAction<string>>;
}

/**
 * Retorna um campo de pesquisa. É um componente controlado.
 *
 * @see {@link ISearchbarProps}
 *
 * @param {string} value Valor do campo. Exemplo: `Exames em arapiraca`
 * @param {Dispatch<SetStateAction<string>>} handler Controlador do valor do campo. É fornecido como segundo parâmetro do `useState`
 * @param {HTMLProps<HTMLInputElement>} props Props nativas do elemento também podem ser passadas para este
 */
const SearchbarComponent: FC<ISearchbarProps> = ({ value, handler, ...props }) => {
	const { t } = useTranslation("translation");

	const changeValue = useCallback(
		({ target }: ChangeEvent<HTMLInputElement>) => {
			handler(target.value);
		},
		[handler]
	);

	return (
		<div
			className={`flex justify-start items-center w-full h-9 pl-2 pr-2 rounded-project
			bg-white-minusOne print:hidden ${props.disabled ? "brightness-95 cursor-not-allowed" : ""}`}
		>
			<label htmlFor="searchbar" className="sr-only">
				Pesquise por um exame:
			</label>
			<input
				{...props}
				id="searchbar"
				name="search"
				type="search"
				placeholder={t("search.placeholder")}
				className="w-full text-sm h-6 px-2 mr-2 select-none rounded-project outline-2 outline-offset-1 
				outline-primary-plusThree focus:outline disabled:cursor-not-allowed"
				value={value}
				onChange={changeValue}
			/>
			<button className="disabled:cursor-not-allowed" disabled={props.disabled} type="submit">
				<span className="sr-only">Clique aqui para pesquisar</span>
				{props.disabled ? (
					<MdSearchOff className="text-black-main text-2xl" />
				) : (
					<MdSearch className="text-black-main text-2xl" />
				)}
			</button>
		</div>
	);
};
export const Searchbar = memo(SearchbarComponent);
