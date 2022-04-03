import React, { useCallback, useState } from "react";
import type { ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { Form, useActionData, useTransition } from "remix";
import type { MetaFunction, ActionFunction, LoaderFunction } from "remix";
import { Alert } from "~/components/data/Alert";
import { Button } from "~/components/input/Button";
import { TextField } from "~/components/input/TextField";
import type { CEP } from "~/entities/CEP";
import { register } from "~/helpers/actions/register.server";
import type { IRegisterActionData } from "~/helpers/actions/register.server";
import { remixI18next } from "~/helpers/i18n.server";

interface LoaderData {
	title: string;
	description: string;
}

export const meta: MetaFunction = ({ data }: { data: LoaderData }) => {
	const title = data.title;
	const description = data.description;
	const url = "https://ifal.vercel.app/auth/registrar";

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

export const loader: LoaderFunction = async ({ request }): Promise<LoaderData> => {
	const t = await remixI18next.getFixedT(request, "translation");
	return { title: t("register.title"), description: t("register.description") };
};

export const action: ActionFunction = async ({ request }): Promise<IRegisterActionData> => {
	return await register(request);
};

export default function Register() {
	const actionData = useActionData<IRegisterActionData>();
	const transition = useTransition();
	const i18n = useTranslation("common");
	const { t } = useTranslation("translation");

	const totalPages = 3;
	const [currentPage, setCurrentPage] = useState(0);

	const [cep, setCEP] = useState("");
	const [cepErr, setCEPErr] = useState("");
	const [state, setState] = useState("");
	const [city, setCity] = useState("");
	const [street, setStreet] = useState("");
	const [neighborhood, setNeighborhood] = useState("");

	const goPrevious = useCallback(() => {
		if (currentPage <= 0) return;
		setCurrentPage(currentPage - 1);
	}, [currentPage]);

	const goNext = useCallback(() => {
		if (currentPage >= totalPages) return;
		setCurrentPage(currentPage + 1);
	}, [currentPage]);

	const handleFieldChange = useCallback(({ target }: ChangeEvent<HTMLInputElement>) => {
		const fieldName = target.getAttribute("name");
		if (!fieldName) return;

		switch (fieldName) {
			case "cep":
				setCEP(target.value);
				setCEPErr("");
				break;
			case "state":
				setState(target.value);
				break;
			case "city":
				setCity(target.value);
				break;
			case "street":
				setStreet(target.value);
				break;
			case "neighborhood":
				setNeighborhood(target.value);
				break;
			default:
				break;
		}
	}, []);

	const getCEPData = useCallback(() => {
		const getData = async () => {
			const response = await fetch(`https://brasilapi.com.br/api/cep/v2/${cep}`);
			if (response.ok) {
				const data: CEP = await response.json();
				return data;
			}
			setCEPErr(t("register.verifyPostalCode"));
			setState("");
			setCity("");
			setStreet("");
			setNeighborhood("");
			return null;
		};

		if (cep && cep.length === 10) {
			getData()
				.then(data => {
					if (!data) return;
					setState(data.state);
					setCity(data.city);
					setStreet(data.street);
					setNeighborhood(data.neighborhood);
				})
				.catch(() => setCEPErr("Não foi possível verificar seu CEP."));
		}
	}, [cep, t]);

	return (
		<div className="flex flex-col justify-start items-center md:items-start w-full max-w-[540px] h-full p-2 pt-0 mt-3 md:mt-0">
			<div className="w-full h-auto mb-1">
				<h2 className="text-black-plusOne font-medium text-3xl text-center md:text-left w-full h-12 max-w-full truncate">
					{t("register.formTitle")}
				</h2>
			</div>
			{actionData?.formError && !actionData.completed && (
				<div className="flex justify-center items-center w-full h-auto mb-2">
					<Alert {...actionData.formError} />
				</div>
			)}
			{actionData?.completed && (
				<div className="flex justify-center items-center w-full h-auto mb-2">
					<Alert label={t("register.success")} variant="info" />
				</div>
			)}
			<div className="w-full h-fit bg-white-minusOne rounded-project p-5 shadow-sm">
				<Form method="post">
					<div className={`${currentPage === 0 ? "flex" : "hidden"} flex-col w-full`}>
						<TextField
							name="cpf"
							label={t("register.cpf")}
							isSensitive
							helperText={t("register.cpfHelper")}
							isError={!!actionData?.fieldErrors?.cpf}
							errorMessage={actionData?.fieldErrors?.cpf}
							options={{
								blocks: [3, 3, 3, 2],
								delimiters: [".", ".", "-"],
								numericOnly: true,
							}}
						/>
						<TextField
							name="fullName"
							label={t("register.fullName")}
							isError={!!actionData?.fieldErrors?.fullName}
							errorMessage={actionData?.fieldErrors?.fullName}
							disableCleave
						/>
						<TextField
							name="birthDay"
							label={t("register.birthDay")}
							helperText={t("register.birthDayHelper")}
							isError={!!actionData?.fieldErrors?.birthDay}
							errorMessage={actionData?.fieldErrors?.birthDay}
							options={{
								date: true,
								datePattern: ["d", "m", "Y"],
								numericOnly: true,
							}}
						/>
					</div>
					<div className={`${currentPage === 1 ? "flex" : "hidden"} flex-col w-full`}>
						<TextField
							name="phone"
							label={t("register.phone")}
							helperText={t("register.phoneHelper")}
							isError={!!actionData?.fieldErrors?.phone}
							errorMessage={actionData?.fieldErrors?.phone}
							options={{
								blocks: [2, 5, 4],
								delimiters: [" ", "-"],
								numericOnly: true,
							}}
						/>
						<TextField
							name="email"
							label={t("register.email")}
							isError={!!actionData?.fieldErrors?.email}
							errorMessage={actionData?.fieldErrors?.email}
						/>
						<TextField
							name="emailConfirm"
							label={t("register.emailConfirm")}
							helperText={t("register.emailConfirmHelper")}
							isError={!!actionData?.fieldErrors?.emailConfirm}
							errorMessage={actionData?.fieldErrors?.emailConfirm}
						/>
					</div>
					<div className={`${currentPage === 2 ? "flex" : "hidden"} flex-col w-full`}>
						<TextField
							name="cep"
							label={t("register.postalCode")}
							helperText={t("register.postalCodeHelper")}
							isError={!!actionData?.fieldErrors?.cep || !!cepErr}
							errorMessage={actionData?.fieldErrors?.cep || cepErr}
							value={cep}
							onChange={handleFieldChange}
							onBlur={getCEPData}
							options={{
								blocks: [2, 3, 3],
								delimiters: [".", "-"],
								numericOnly: true,
							}}
						/>
						<TextField
							name="state"
							label={t("register.state")}
							isError={!!actionData?.fieldErrors?.state}
							errorMessage={actionData?.fieldErrors?.state}
							value={state}
							onChange={handleFieldChange}
							disableCleave
							disabled
						/>
						<TextField
							name="city"
							label={t("register.city")}
							isError={!!actionData?.fieldErrors?.city}
							errorMessage={actionData?.fieldErrors?.city}
							value={city}
							onChange={handleFieldChange}
							disableCleave
							disabled
						/>
						<TextField
							name="street"
							label={t("register.street")}
							isError={!!actionData?.fieldErrors?.street}
							errorMessage={actionData?.fieldErrors?.street}
							value={street}
							onChange={handleFieldChange}
							disableCleave
							disabled
						/>
						<TextField
							name="neighborhood"
							label={t("register.neighborhood")}
							isError={!!actionData?.fieldErrors?.neighborhood}
							errorMessage={actionData?.fieldErrors?.neighborhood}
							value={neighborhood}
							onChange={handleFieldChange}
							disableCleave
							disabled
						/>
						<TextField
							name="houseNumber"
							label={t("register.houseNumber")}
							isError={!!actionData?.fieldErrors?.houseNumber}
							errorMessage={actionData?.fieldErrors?.houseNumber}
							options={{
								numericOnly: true,
							}}
						/>
						<TextField
							name="complement"
							label={t("register.complement")}
							helperText={t("register.complementHelper")}
							isError={!!actionData?.fieldErrors?.complement}
							errorMessage={actionData?.fieldErrors?.complement}
							disableCleave
						/>
					</div>
					<div className={`${currentPage === 3 ? "flex" : "hidden"} flex-col w-full`}>
						<TextField
							name="password"
							label={t("register.password")}
							helperText={t("register.passwordHelper")}
							isSensitive
							isError={!!actionData?.fieldErrors?.password}
							errorMessage={actionData?.fieldErrors?.password}
						/>
						<TextField
							name="passwordConfirm"
							label={t("register.passwordConfirm")}
							helperText={t("register.passwordConfirmHelper")}
							isSensitive
							isError={!!actionData?.fieldErrors?.passwordConfirm}
							errorMessage={actionData?.fieldErrors?.passwordConfirm}
						/>
						<div className="w-full pt-4">
							<Alert label={t("register.alert")} />
						</div>
					</div>
					<div className="flex justify-between items-center w-full px-1 pt-8">
						{currentPage > 0 && (
							<div className="flex justify-start items-center w-full">
								<Button
									label={
										transition.state === "idle"
											? i18n.t("goBack")
											: i18n.t("loading")
									}
									variant="blue"
									type="button"
									onClick={goPrevious}
									disabled={transition.state === "submitting"}
								/>
							</div>
						)}
						<div className="flex justify-end items-center w-full">
							{currentPage < totalPages && (
								<Button
									label={
										transition.state === "idle"
											? t("form.nextStep")
											: i18n.t("loading")
									}
									variant="blue"
									type="button"
									onClick={goNext}
									disabled={transition.state === "submitting"}
								/>
							)}
							{currentPage >= totalPages && (
								<Button
									label={
										transition.state === "idle"
											? t("navigationOptions.register")
											: i18n.t("loading")
									}
									variant="green"
									type={transition.state === "idle" ? "submit" : "button"}
									disabled={transition.state === "submitting"}
								/>
							)}
						</div>
					</div>
				</Form>
			</div>
		</div>
	);
}
