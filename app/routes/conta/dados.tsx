import React from "react";
import type { MetaFunction } from "remix";
import { useAuth } from "~/components/context/AuthContext";
import { Button } from "~/components/input/Button";
import { TextField } from "~/components/input/TextField";

export const meta: MetaFunction = () => {
	const title = "Dados pessoais - IFAL";
	const description = "Veja e controle os dados pessoais da sua conta.";
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
							CPF: <strong>{user?.profile.cpf || "000.000.000-00"}</strong>
						</span>
						<span>
							Nome completo: <strong>{user?.profile.fullName || "..."}</strong>
						</span>
						<span>
							Data de nascimento:{" "}
							<strong>{user?.profile.birthDay || "00/00/0000"}</strong>
						</span>
					</div>
					<div className="pt-2 px-2">
						<div className="flex">
							<div className="w-full mr-3">
								<TextField label="Sexo:" value={user?.profile.gender} />
							</div>
							<div className="w-full ml-3">
								<TextField label="Etnia:" value={user?.profile.ethnicity} />
							</div>
						</div>
						<div className="flex">
							<div className="w-full mr-3">
								<TextField
									label="Estado de nascimento:"
									value={user?.profile.birthState}
								/>
							</div>
							<div className="w-full ml-3">
								<TextField
									label="Cidade de nascimento:"
									value={user?.profile.birthCity}
								/>
							</div>
						</div>
						<div className="flex">
							<div className="w-3/4 mr-2">
								<TextField
									label="Nome do(a) responsável:"
									value={user?.profile.responsiblePersonFullName || ""}
								/>
							</div>
							<div className="w-2/4 ml-2">
								<TextField
									label="Parentesco do(a) responsável:"
									value={user?.profile.responsiblePersonKinship || ""}
								/>
							</div>
						</div>
					</div>
				</div>
				<div className="flex flex-col justify-start items-start w-full h-fit pb-3">
					<h3 className="text-lg text-black-plusOne">Contato</h3>
					<div className="flex px-2">
						<div className="w-full mr-3">
							<TextField
								label="Telefone:"
								value={user?.profile.phone}
								options={{ phone: true, phoneRegionCode: "BR" }}
							/>
						</div>
						<div className="w-full ml-3">
							<TextField label="Email:" value={user?.email} />
						</div>
					</div>
				</div>
				<div className="flex flex-col justify-start items-start w-full h-fit pb-3">
					<h3 className="text-lg text-black-plusOne">Endereço</h3>
					<div className="px-2">
						<div className="flex">
							<div className="w-3/4 mr-2">
								<TextField label="Logradouro:" value={user?.profile.street} />
							</div>
							<div className="w-1/4 ml-2">
								<TextField
									label="Número:"
									value={user?.profile.houseNumber}
									options={{ numericOnly: true, numeralPositiveOnly: true }}
								/>
							</div>
						</div>
						<div className="flex">
							<div className="w-full mr-3">
								<TextField label="Bairro:" value={user?.profile.neighborhood} />
							</div>
							<div className="w-full ml-3">
								<TextField
									label="CEP:"
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
							label="Complemento:"
							value={user?.profile.complement || ""}
							helperText="Campo não obrigatório."
						/>
					</div>
				</div>
				<div className="flex justify-end items-center w-full h-auto pt-2">
					<Button label="Salvar" />
				</div>
			</div>
		</div>
	);
}
