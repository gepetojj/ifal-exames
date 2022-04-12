import { Listbox } from "@headlessui/react";

import React, { memo, useCallback, useState } from "react";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { MdKeyboardArrowUp } from "react-icons/md";

export interface ILanguage {
	id: string;
	label: string;
	icon: string;
}

/**
 * Retorna um select específico para alterar a língua do usuário.
 *
 * Este componente não aceita nenhum parâmetro.
 */
const LanguageSelectorComponent: FC = () => {
	const { i18n } = useTranslation();
	const [languages] = useState<ILanguage[]>([
		{
			id: "pt-BR",
			label: "Português do Brasil",
			icon: "br-flag",
		},
		{
			id: "en",
			label: "English",
			icon: "en-flag",
		},
		{
			id: "es",
			label: "Español",
			icon: "es-flag",
		},
	]);
	const [selectedLanguage, setSelectedLanguage] = useState(
		languages.find(language => language.id === i18n.language) || languages[0]
	);

	const onChange = useCallback(
		(newLanguage: ILanguage) => {
			console.log(newLanguage.id);
			setSelectedLanguage(newLanguage);
			i18n.changeLanguage(newLanguage.id);
		},
		[i18n]
	);

	return (
		<Listbox value={selectedLanguage} onChange={onChange}>
			{({ open }) => (
				<div className="relative w-full max-w-[20rem]">
					<Listbox.Button className="flex justify-center items-center w-full p-2 border border-black-plusOne rounded-project">
						<div className="flex justify-center items-center w-full text-white-minusOne">
							<img
								className="w-8"
								width={32}
								height={21}
								src={`/images/${selectedLanguage.icon}.webp`}
								alt="Bandeira da língua"
							/>
							<span className="pl-3">{selectedLanguage.label}</span>
						</div>
						<MdKeyboardArrowUp
							className={`w-fit text-3xl text-white-minusOne ${
								open ? "rotate-0" : "rotate-180"
							} duration-200`}
						/>
					</Listbox.Button>
					<Listbox.Options className="flex flex-col absolute top-14 w-full p-2 bg-primary-minusOne rounded-project">
						{languages
							.filter(language => language.id !== selectedLanguage.id)
							.map(language => (
								<Listbox.Option
									className="flex justify-center items-center w-full text-white-minusOne py-1 
									cursor-pointer duration-200 bg-primary-minusOne rounded-project hover:brightness-90"
									key={language.id}
									value={language}
								>
									<img
										className="w-8"
										width={32}
										height={21}
										src={`/images/${language.icon}.webp`}
										alt="Bandeira da língua"
									/>
									<span className="pl-3">{language.label}</span>
								</Listbox.Option>
							))}
					</Listbox.Options>
				</div>
			)}
		</Listbox>
	);
};

export const LanguageSelector = memo(LanguageSelectorComponent);
