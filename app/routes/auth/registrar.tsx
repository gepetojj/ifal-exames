import React, { ChangeEvent, useCallback, useState } from "react";
import { Form, useActionData, useTransition } from "remix";
import type { MetaFunction, ActionFunction } from "remix";
import { Alert } from "~/components/data/Alert";
import type { IAlertProps } from "~/components/data/Alert";
import { Button } from "~/components/input/Button";
import { TextField } from "~/components/input/TextField";
import type { CEP } from "~/entities/CEP";
import { createUser } from "~/helpers/api/users/users.server";
import { randomUUID } from "~/helpers/crypto.server";
import { birthDayValidator } from "~/helpers/validators/birthDay.server";
import { cepValidator } from "~/helpers/validators/cep.server";
import { complementValidator } from "~/helpers/validators/complement.server";
import { cpfValidator } from "~/helpers/validators/cpf.server";
import { emailValidator } from "~/helpers/validators/email.server";
import { houseNumberValidator } from "~/helpers/validators/houseNumber.server";
import { passwordValidator } from "~/helpers/validators/password.server";
import { phoneValidator } from "~/helpers/validators/phone.server";
import { textValidator } from "~/helpers/validators/text.server";

interface ActionData {
	formError?: IAlertProps;
	fieldErrors?: {
		cpf?: string;
		fullName?: string;
		birthDay?: string;
		phone?: string;
		email?: string;
		emailConfirm?: string;
		street?: string;
		houseNumber?: string;
		neighborhood?: string;
		complement?: string;
		cep?: string;
		state?: string;
		city?: string;
		password?: string;
		passwordConfirm?: string;
	};
	completed?: boolean;
}

export const meta: MetaFunction = () => {
	const title = "Crie sua conta - IFAL";
	const description =
		"Crie sua conta do Sistema de Seleção do IFAL para poder participar de seleções e mais!";
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

export const action: ActionFunction = async ({ request }) => {
	const body = await request.formData();
	const cpf = body.get("cpf")?.toString();
	const fullName = body.get("fullName")?.toString();
	const birthDay = body.get("birthDay")?.toString();
	const phone = body.get("phone")?.toString();
	const email = body.get("email")?.toString();
	const emailConfirm = body.get("emailConfirm")?.toString();
	const cep = body.get("cep")?.toString();
	const houseNumber = body.get("houseNumber")?.toString();
	const complement = body.get("complement")?.toString();
	const password = body.get("password")?.toString();
	const passwordConfirm = body.get("passwordConfirm")?.toString();

	const cpfErr = cpfValidator(cpf);
	const nameErr = textValidator(fullName);
	const birthDayErr = birthDayValidator(birthDay);
	const phoneErr = phoneValidator(phone);
	const emailErr = emailValidator(email, emailConfirm);
	const emailConfirmErr = emailValidator(emailConfirm, email);
	const cepErr = cepValidator(cep);
	const houseNumberErr = houseNumberValidator(houseNumber);
	const complementErr = complementValidator(complement);
	const passwordErr = passwordValidator(password, passwordConfirm);
	const passwordConfirmErr = passwordValidator(passwordConfirm, password);

	const errors = [
		cpfErr,
		nameErr,
		birthDayErr,
		phoneErr,
		emailErr,
		emailConfirmErr,
		cepErr,
		houseNumberErr,
		complementErr,
		passwordErr,
		passwordConfirmErr,
	];

	if (errors.find(error => error !== undefined)) {
		return {
			formError: {
				label: "Há campos que necessitam ser corrigidos.",
				variant: "alert",
			},
			fieldErrors: {
				cpf: cpfErr,
				fullName: nameErr,
				birthDay: birthDayErr,
				phone: phoneErr,
				email: emailErr,
				emailConfirm: emailConfirmErr,
				cep: cepErr,
				houseNumber: houseNumberErr,
				complement: complementErr,
				password: passwordErr,
				passwordConfirm: passwordConfirmErr,
			},
		};
	}

	const userCreation = await createUser(
		{
			id: randomUUID(),
			// @ts-expect-error (`Username` não pode ser `undefined`, já foi verificado.)
			username: email,
			// @ts-expect-error (`Email` não pode ser `undefined`, já foi verificado.)
			email,
			profile: {
				// @ts-expect-error (`CPF` não pode ser `undefined`, já foi verificado.)
				cpf,
				// @ts-expect-error (`FullName` não pode ser `undefined`, já foi verificado.)
				fullName,
				// @ts-expect-error (`BirthDay` não pode ser `undefined`, já foi verificado.)
				birthDay,
				gender: "undefined",
				ethnicity: "undefined",
				birthState: "",
				birthCity: "",
				responsiblePersonFullName: undefined,
				responsiblePersonKinship: undefined,
				// @ts-expect-error (`Phone` não pode ser `undefined`, já foi verificado.)
				phone,
				// @ts-expect-error (`Email` não pode ser `undefined`, já foi verificado.)
				email,
				street: "",
				// @ts-expect-error (`HouseNumber` não pode ser `undefined`, já foi verificado.)
				houseNumber,
				neighborhood: "",
				// @ts-expect-error (`Complement` não pode ser `undefined`, já foi verificado.)
				complement,
				// @ts-expect-error (`CEP` não pode ser `undefined`, já foi verificado.)
				cep,
				state: "",
				city: "",
				role: "student",
			},
		},
		password
	);

	if (userCreation.isError || userCreation.errorCode) {
		console.log(userCreation);
		return {
			formError: {
				label: "Não foi possível concluir seu cadastro. Tente novamente.",
				variant: "error",
			},
		};
	}

	return { completed: true };
};

export default function Register() {
	const actionData = useActionData<ActionData>();
	const transition = useTransition();

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
			setCEPErr("Verifique se este CEP está correto.");
			setState("");
			setCity("");
			setStreet("");
			setNeighborhood("");
			return null;
		};

		if (cep && cep.length === 10) {
			getData().then(data => {
				if (data) {
					setState(data.state);
					setCity(data.city);
					setStreet(data.street);
					setNeighborhood(data.neighborhood);
				}
			});
		}
	}, [cep]);

	return (
		<div className="flex flex-col justify-start items-center md:items-start w-full max-w-[540px] h-full p-2 pt-0 mt-3 md:mt-0">
			<div className="w-full h-auto mb-1">
				<h2 className="text-black-plusOne font-medium text-3xl text-center md:text-left w-full h-12 max-w-full truncate">
					Crie sua conta
				</h2>
			</div>
			{actionData?.formError && (
				<div className="flex justify-center items-center w-full h-auto mb-2">
					<Alert {...actionData?.formError} />
				</div>
			)}
			{actionData?.completed && (
				<div className="flex justify-center items-center w-full h-auto mb-2">
					<Alert
						label="Registro concluído, verifique seu email e faça login."
						variant="info"
					/>
				</div>
			)}
			<div className="w-full h-fit bg-white-minusOne rounded-project p-5 shadow-sm">
				<Form method="post">
					<div className={`${currentPage === 0 ? "flex" : "hidden"} flex-col w-full`}>
						<TextField
							name="cpf"
							label="CPF:"
							isSensitive
							helperText="Informe o CPF do candidato."
							isError={Boolean(actionData?.fieldErrors?.cpf)}
							errorMessage={actionData?.fieldErrors?.cpf}
							options={{
								blocks: [3, 3, 3, 2],
								delimiters: [".", ".", "-"],
								numericOnly: true,
							}}
						/>
						<TextField
							name="fullName"
							label="Nome completo:"
							isError={Boolean(actionData?.fieldErrors?.fullName)}
							errorMessage={actionData?.fieldErrors?.fullName}
							disableCleave
						/>
						<TextField
							name="birthDay"
							label="Data de nascimento:"
							helperText="Formato: DD/MM/AAAA. Exemplo: 01/01/2021"
							isError={Boolean(actionData?.fieldErrors?.birthDay)}
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
							label="Telefone:"
							helperText="Formato: (00) 90000-0000"
							isError={Boolean(actionData?.fieldErrors?.phone)}
							errorMessage={actionData?.fieldErrors?.phone}
							options={{
								blocks: [2, 5, 4],
								delimiters: [" ", "-"],
								numericOnly: true,
							}}
						/>
						<TextField
							name="email"
							label="Email:"
							isError={Boolean(actionData?.fieldErrors?.email)}
							errorMessage={actionData?.fieldErrors?.email}
						/>
						<TextField
							name="emailConfirm"
							label="Confirme o email:"
							helperText="Digite seu Email novamente."
							isError={Boolean(actionData?.fieldErrors?.emailConfirm)}
							errorMessage={actionData?.fieldErrors?.emailConfirm}
						/>
					</div>
					<div className={`${currentPage === 2 ? "flex" : "hidden"} flex-col w-full`}>
						<TextField
							name="cep"
							label="CEP:"
							helperText="Formato: 00.000-000"
							isError={Boolean(actionData?.fieldErrors?.cep) || Boolean(cepErr)}
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
							label="Estado:"
							isError={Boolean(actionData?.fieldErrors?.state)}
							errorMessage={actionData?.fieldErrors?.state}
							value={state}
							onChange={handleFieldChange}
							disableCleave
							disabled
						/>
						<TextField
							name="city"
							label="Cidade:"
							isError={Boolean(actionData?.fieldErrors?.city)}
							errorMessage={actionData?.fieldErrors?.city}
							value={city}
							onChange={handleFieldChange}
							disableCleave
							disabled
						/>
						<TextField
							name="street"
							label="Logradouro:"
							isError={Boolean(actionData?.fieldErrors?.street)}
							errorMessage={actionData?.fieldErrors?.street}
							value={street}
							onChange={handleFieldChange}
							disableCleave
							disabled
						/>
						<TextField
							name="neighborhood"
							label="Bairro:"
							isError={Boolean(actionData?.fieldErrors?.neighborhood)}
							errorMessage={actionData?.fieldErrors?.neighborhood}
							value={neighborhood}
							onChange={handleFieldChange}
							disableCleave
							disabled
						/>
						<TextField
							name="houseNumber"
							label="Número:"
							isError={Boolean(actionData?.fieldErrors?.houseNumber)}
							errorMessage={actionData?.fieldErrors?.houseNumber}
							options={{
								numericOnly: true,
							}}
						/>
						<TextField
							name="complement"
							label="Complemento:"
							helperText="Exemplo: Casa B, Apto. 301, etc. (Campo não obrigatório)"
							isError={Boolean(actionData?.fieldErrors?.complement)}
							errorMessage={actionData?.fieldErrors?.complement}
							disableCleave
						/>
					</div>
					<div className={`${currentPage === 3 ? "flex" : "hidden"} flex-col w-full`}>
						<TextField
							name="password"
							label="Senha:"
							helperText="A senha deve ter no mínimo 10 caracteres, com letras e números."
							isSensitive
							isError={Boolean(actionData?.fieldErrors?.password)}
							errorMessage={actionData?.fieldErrors?.password}
						/>
						<TextField
							name="passwordConfirm"
							label="Confirme a senha:"
							helperText="Digite sua senha novamente."
							isSensitive
							isError={Boolean(actionData?.fieldErrors?.passwordConfirm)}
							errorMessage={actionData?.fieldErrors?.passwordConfirm}
						/>
						<div className="w-full pt-4">
							<Alert
								label="Ao enviar este formulário você declara, para os fins de direito, 
								sob as penas da lei, que as informações que apresenta para o cadastro, 
								são fiéis à verdade e condizentes com a realidade dos fatos. Fica ciente, 
								portanto, que a falsidade desta declaração configura-se em crime previsto 
								no Código Penal Brasileiro e passível de apuração na forma da Lei."
							/>
						</div>
					</div>
					<div className="flex justify-between items-center w-full px-1 pt-8">
						{currentPage > 0 && (
							<div className="flex justify-start items-center w-full">
								<Button
									label={transition.state === "idle" ? "Voltar" : "Carregando..."}
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
											? "Próxima etapa"
											: "Carregando..."
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
											? "Criar conta"
											: "Carregando..."
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
