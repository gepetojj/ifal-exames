import { Listbox } from "@headlessui/react";

import React, { memo, useState, useEffect } from "react";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { HiSelector } from "react-icons/hi";
import { MdDone } from "react-icons/md";

export interface ISelectItem {
	id: string;
	label: string;
}

export interface ISelectProps {
	label: string;
	valueId?: string;
	items: ISelectItem[];
	onChange?: (value: ISelectItem) => void;
}

/**
 * Retorna um select.
 *
 * @see {@link 	ISelectProps}
 *
 * @param {string} label Placeholder do input. Exemplo: `Estado de nascimento:`
 * @param {string} valueId (Opcional) Id do valor padrão para o input. Se nenhum for especificado, o primeiro da lista será escolhido. Exemplo: `Alagoas`
 * @param {IComboboxItem[]} items Array de itens possíveis neste autocomplete. Exemplo: `["Alagoas", "Pernambuco", "Bahia"]`
 * @param {(value: ISelectItem) => void} onChange (Opcional) Callback que será executado toda vez que o usuário mudar de opção no select.
 */
const SelectComponent: FC<ISelectProps> = ({ label, valueId, items, onChange }) => {
	const [selected, setSelected] = useState(
		(valueId && items.find(item => item.id === valueId)) || items[0]
	);
	const { t } = useTranslation("common");

	useEffect(() => {
		onChange && onChange(selected);
	}, [selected, onChange]);

	return (
		<Listbox value={selected} onChange={setSelected}>
			<div className="flex flex-col relative w-full max-w-[98vw] h-auto mb-1">
				<span className="text-xs w-full relative top-[4px] pl-[6px] transition ease-in-out origin-left select-none duration-project truncate">
					{label}
				</span>
				<Listbox.Button
					className="flex flex-start w-full px-2 py-1 outline-none border-b bg-transparent transition duration-project 
					disabled:bg-white-minusFour disabled:cursor-not-allowed"
				>
					{selected?.label || t("error.invalidOption")}
				</Listbox.Button>
				<HiSelector className="absolute right-1 top-6" />
				<Listbox.Options className="absolute w-full max-h-[12rem] bg-white-minusThree rounded-project p-2 mt-2 top-12 z-10 overflow-y-auto">
					{items?.length
						? items.map(item => (
								<Listbox.Option key={item.id} value={item}>
									{({ active, selected }) => (
										<div
											className={`flex flex-row justify-between items-center px-2 py-1 cursor-pointer rounded-project duration-200 ${
												active && "bg-white-minusFour"
											} ${selected && "border border-black-plusThree/20"}`}
										>
											{item.label || t("error.invalidOption")}
											{selected && <MdDone />}
										</div>
									)}
								</Listbox.Option>
						  ))
						: t("error.invalidOption")}
				</Listbox.Options>
			</div>
		</Listbox>
	);
};

export const Select = memo(SelectComponent);
