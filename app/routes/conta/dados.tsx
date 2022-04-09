import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { LoaderFunction, MetaFunction } from "remix";
import { useAuth } from "~/components/context/AuthContext";
import { Button } from "~/components/input/Button";
import { Select } from "~/components/input/Select";
import type { ISelectItem } from "~/components/input/Select";
import { TextField } from "~/components/input/TextField";
import { remixI18next } from "~/helpers/i18n.server";

interface LoaderData {
	title: string;
	description: string;
}

interface State {
	id: number;
	sigla: string;
	nome: string;
	regiao: {
		id: number;
		sigla: string;
		nome: string;
	};
}

interface City {
	id: string;
	nome: string;
}

export const loader: LoaderFunction = async ({ request }): Promise<LoaderData> => {
	const t = await remixI18next.getFixedT(request, "translation");
	return { title: t("account.data.title"), description: t("account.data.description") };
};

export const meta: MetaFunction = ({ data }: { data: LoaderData }) => {
	const title = data.title;
	const description = data.description;
	const url = "https://ifal.vercel.app/conta/dados";

	return {
		title,
		description,
		"og:title": title,
		"og:description": description,
		"og:url": url,
		"twitter:title": title,
		"twitter:description": description,
		"twitter:url": url,
	};
};

export default function AccountData() {
	const { user } = useAuth();
	const { t } = useTranslation("translation");
	const i18n = useTranslation("common");

	const [states, setStates] = useState<ISelectItem[]>([]);
	const [selectedState, setSelectedState] = useState("");
	const [cities, setCities] = useState<ISelectItem[]>([]);

	const loadStates = useCallback(async () => {
		const url = "https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome";
		const response = await fetch(url);

		if (!response.ok) {
			console.error("Não foi possível carregar os estados brasileiros.");
			return;
		}

		const states: State[] = await response.json();
		for (const state of states) {
			setStates(states => [...states, { id: String(state.id), label: state.nome }]);
		}
	}, []);

	const loadCitiesByState = useCallback(async () => {
		const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedState}/municipios?orderBy=nome`;
		const response = await fetch(url);

		if (!response.ok) {
			console.error(`Não foi possível carregar as cidades do estado '${selectedState}'`);
			return;
		}

		const cities: City[] = await response.json();
		const filteredCities: ISelectItem[] = [];
		for (const city of cities) filteredCities.push({ id: city.id, label: city.nome });
		setCities(filteredCities);
	}, [selectedState]);

	useEffect(() => {
		loadStates();
	}, [loadStates]);

	useEffect(() => {
		loadCitiesByState();
	}, [selectedState, loadCitiesByState]);

	return (
		<div className="flex flex-col justify-start items-center md:items-start w-full max-w-[540px] h-full p-2 pt-0 mt-3 md:mt-0">
			<div className="w-full h-auto mb-1">
				<h2 className="text-black-plusOne font-medium text-3xl text-center md:text-left w-full h-12 max-w-full truncate">
					Dados pessoais
				</h2>
			</div>
			<div className="w-full h-fit bg-white-minusOne rounded-project p-5 shadow-sm">
				<div className="flex flex-col justify-start items-start w-full h-fit pb-3">
					<h3 className="text-lg text-black-plusOne">Informações básicas</h3>
					<div className="flex flex-col w-full pt-2 px-2 text-black-plusThree">
						<span>
							{t("register.cpf")}{" "}
							<strong>{user?.profile.cpf || "000.000.000-00"}</strong>
						</span>
						<span>
							{t("register.fullName")}{" "}
							<strong>{user?.profile.fullName || "..."}</strong>
						</span>
						<span>
							{t("register.birthDay")}{" "}
							<strong>{user?.profile.birthDay || "00/00/0000"}</strong>
						</span>
					</div>
					<div className="pt-2 px-2">
						<div className="flex mb-1">
							<div className="w-full mr-3">
								<Select
									label="Sexo:"
									valueId={user?.profile.gender}
									items={[
										{ id: "noinfo", label: "Não informar" },
										{ id: "male", label: "Masculino" },
										{ id: "female", label: "Feminino" },
										{ id: "other", label: "Outro" },
									]}
								/>
							</div>
							<div className="w-full ml-3">
								<Select
									label="Etnia:"
									valueId={user?.profile.ethnicity}
									items={[
										{ id: "noinfo", label: "Não informar" },
										{ id: "white", label: "Branco" },
										{ id: "black", label: "Negro" },
										{ id: "mulatto", label: "Pardo" },
										{ id: "indigenous", label: "Indígena" },
										{ id: "yellow", label: "Amarelo" },
									]}
								/>
							</div>
						</div>
						<div className="flex mb-1">
							<div className="w-full mr-3">
								<Select
									label="Estado de nascimento:"
									valueId={user?.profile.birthState}
									items={states}
									onChange={item => setSelectedState(item?.id || "")}
								/>
							</div>
							<div className="w-full ml-3">
								<Select
									label="Cidade de nascimento:"
									valueId={user?.profile.birthCity}
									items={cities}
								/>
							</div>
						</div>
						<div className="flex">
							<div className="w-3/4 mr-2">
								<TextField
									label="Nome do(a) responsável:"
									value={user?.profile.responsiblePersonFullName || ""}
									disableCleave
								/>
							</div>
							<div className="w-2/4 ml-2">
								<Select
									label="Parentesco do(a) responsável:"
									valueId={user?.profile.responsiblePersonKinship || ""}
									items={[
										{ id: "noinfo", label: "Não informar" },
										{ id: "grandfather", label: "Avô" },
										{ id: "grandmother", label: "Avó" },
										{ id: "father", label: "Pai" },
										{ id: "mother", label: "Mãe" },
										{ id: "responsible", label: "Responsável legal" },
									]}
								/>
							</div>
						</div>
					</div>
				</div>
				<div className="flex flex-col justify-start items-start w-full h-fit pb-3">
					<h3 className="text-lg text-black-plusOne mb-1">Contato</h3>
					<div className="flex px-2">
						<div className="w-full mr-3">
							<TextField
								label={t("register.phone")}
								value={user?.profile.phone}
								options={{
									blocks: [2, 5, 4],
									delimiters: [" ", "-"],
									numericOnly: true,
								}}
							/>
						</div>
						<div className="w-full ml-3">
							<TextField label={t("register.email")} value={user?.email} />
						</div>
					</div>
				</div>
				<div className="flex flex-col justify-start items-start w-full h-fit pb-3">
					<h3 className="text-lg text-black-plusOne mb-1">Endereço</h3>
					<div className="px-2">
						<div className="flex mb-1">
							<div className="w-3/4 mr-2">
								<TextField
									label={t("register.street")}
									value={user?.profile.street}
									disableCleave
								/>
							</div>
							<div className="w-1/4 ml-2">
								<TextField
									label={t("register.houseNumber")}
									value={user?.profile.houseNumber}
									options={{ numericOnly: true, numeralPositiveOnly: true }}
								/>
							</div>
						</div>
						<div className="flex mb-1">
							<div className="w-full mr-3">
								<TextField
									label={t("register.neighborhood")}
									value={user?.profile.neighborhood}
									disableCleave
								/>
							</div>
							<div className="w-full ml-3">
								<TextField
									label={t("register.postalCode")}
									value={user?.profile.cep}
									options={{
										blocks: [2, 3, 3],
										delimiters: [".", "-"],
										numericOnly: true,
									}}
								/>
							</div>
						</div>
						<TextField
							label={t("register.complement")}
							value={user?.profile.complement || ""}
							helperText={t("register.complementHelper")}
							disableCleave
						/>
					</div>
				</div>
				<div className="flex justify-end items-center w-full h-auto pt-2">
					<Button label={i18n.t("controls.save")} />
				</div>
			</div>
		</div>
	);
}
