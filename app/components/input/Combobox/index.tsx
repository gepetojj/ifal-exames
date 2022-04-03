import { Combobox as HUICombobox } from "@headlessui/react";

import React, { memo, useCallback, useEffect, useState } from "react";
import type { FC, ChangeEvent } from "react";
import { HiSelector } from "react-icons/hi";
import { MdDone } from "react-icons/md";

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

const ComboboxComponent: FC<IComboboxProps> = ({ label, valueId, items }) => {
	const [query, setQuery] = useState("");
	const [selectedItem, setSelectedItem] = useState(
		(valueId && items.find(item => item.id === valueId)) || items[0]
	);
	const [filteredItems, setFilteredItems] = useState<IComboboxItem[]>(items);

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
				<HUICombobox.Options className="absolute w-full bg-white-minusThree rounded-project p-2 mt-2 top-12 z-10">
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
							Opção inválida
						</div>
					)}
				</HUICombobox.Options>
			</div>
		</HUICombobox>
	);
};

export const Combobox = memo(ComboboxComponent);
