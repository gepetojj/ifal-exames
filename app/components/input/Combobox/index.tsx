import React, { memo, useCallback, useEffect, useState } from "react";
import type { FC, ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { HiSelector } from "react-icons/hi";
import { MdDone } from "react-icons/md";
import { Combobox as HUICombobox } from "~/helpers/headlessui.client";

export interface IComboboxItem {
	id: string;
	label: string;
}

export interface IComboboxProps {
	label: string;
	valueId?: string;
	helperText?: string;
	items: IComboboxItem[];
}

/**
 * Retorna um combobox (select com autocomplete).
 *
 * @see {@link IComboboxProps}
 *
 * @param {string} label Placeholder do input. Exemplo: `Estado de nascimento:`
 * @param {string} valueId (Opcional) Id do valor padrão para o input. Se nenhum for especificado, o primeiro da lista será escolhido. Exemplo: `Alagoas`
 * @param {string} helperText (Opcional) Texto de ajuda do input, ficará abaixo dele. Exemplo: `Insira o email do titular da conta.`
 * @param {IComboboxItem[]} items Array de itens possíveis neste autocomplete. Exemplo: `["Alagoas", "Pernambuco", "Bahia"]`
 */
const ComboboxComponent: FC<IComboboxProps> = ({ label, valueId, items }) => {
	const [query, setQuery] = useState("");
	const [selectedItem, setSelectedItem] = useState(
		(valueId && items.find(item => item.id === valueId)) || items[0]
	);
	const [filteredItems, setFilteredItems] = useState<IComboboxItem[]>(items);
	const { t } = useTranslation("common");

	useEffect(() => {
		if (query) {
			setFilteredItems(
				items.filter(item => item.label.toLowerCase().includes(query.toLowerCase()))
			);
			return;
		}
		setFilteredItems(items);
	}, [query, items]);

	const onQueryChange = useCallback(({ target }: ChangeEvent<HTMLInputElement>) => {
		setQuery(target.value);
	}, []);

	return (
		<HUICombobox value={selectedItem} onChange={setSelectedItem}>
			<div className="flex flex-col relative w-full max-w-[98vw] h-auto mb-1">
				<span className="text-xs w-full relative top-[4px] pl-[6px] transition ease-in-out origin-left select-none duration-project truncate">
					{label}
				</span>
				<HUICombobox.Input
					className="w-full px-2 py-1 outline-none border-b bg-transparent transition duration-project disabled:bg-white-minusFour 
					disabled:cursor-not-allowed"
					onChange={onQueryChange}
					displayValue={item => (item as IComboboxItem).label}
				/>
				<HiSelector className="absolute right-1 top-6" />
				<HUICombobox.Options className="absolute w-full max-h-[12rem] bg-white-minusThree rounded-project p-2 mt-2 top-12 z-10 overflow-y-auto">
					{filteredItems.map(item => (
						<HUICombobox.Option key={item.id} value={item}>
							{({ active, selected }) => (
								<div
									className={`flex flex-row justify-between items-center px-2 py-1 cursor-pointer rounded-project duration-200 ${
										active && "bg-white-minusFour"
									} ${selected && "border border-black-plusThree/20"}`}
								>
									{item.label}
									{selected && <MdDone />}
								</div>
							)}
						</HUICombobox.Option>
					))}
					{!filteredItems.length && (
						<div className="flex flex-row justify-between items-center px-2 rounded-project duration-200">
							{t("error.invalidOption")}
						</div>
					)}
				</HUICombobox.Options>
			</div>
		</HUICombobox>
	);
};

export const Combobox = memo(ComboboxComponent);
