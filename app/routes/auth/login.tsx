import React from "react";
import { useTranslation } from "react-i18next";
import { Form, Link, useActionData, useCatch, useLoaderData, useTransition } from "remix";
import type { MetaFunction, ActionFunction, LoaderFunction } from "remix";
import { AuthorizationError } from "remix-auth";
import { Alert } from "~/components/data/Alert";
import type { IAlertProps } from "~/components/data/Alert";
import { Button } from "~/components/input/Button";
import { TextField } from "~/components/input/TextField";
import { remixI18next } from "~/helpers/i18n.server";
import { AuthProvider } from "~/providers/implementations/AuthProvider.server";

interface LoaderData {
	redirectTo?: string;
}

interface ActionData {
	fieldErrors?: {
		email?: string;
		password?: string;
	};
	formError?: IAlertProps;
}

export const meta: MetaFunction = () => {
	const title = "Faça login - IFAL";
	const description =
		"Entre na sua conta do Sistema de Seleção do IFAL para poder inscrever-se em seleções.";
	const url = "https://ifal.vercel.app/auth/login";

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
	const url = new URL(request.url);
	const redirectTo = url.searchParams.get("continue") || "";
	return {
		redirectTo,
	};
};

export const action: ActionFunction = async ({ request }) => {
	const url = new URL(request.url);
	const redirectTo = url.searchParams.get("continue") || "";
	const t = await remixI18next.getFixedT(request, "common");

	try {
		const authenticator = new AuthProvider().handler;
		return await authenticator.authenticate("login", request, {
			successRedirect: redirectTo || "/conta?action=login",
		});
	} catch (err) {
		if (err instanceof Response) throw err;
		if (err instanceof AuthorizationError) {
			switch (err.message) {
				case "invalid_credentials":
					return {
						formError: { label: "Seu email ou senha são inválidos.", variant: "alert" },
					};

				case "error_or_invalid_email":
					return {
						formError: {
							label: "Houve um erro. Verifique se seu email foi digitado corretamente.",
							variant: "error",
						},
					};

				default:
					return {
						formError: { label: t("error.unexpected"), variant: "error" },
					};
			}
		}
	}
};

export function CatchBoundary() {
	const { status, data } = useCatch();
	const i18n = useTranslation("common");
	const { t } = useTranslation("translation");

	return (
		<div className="flex flex-col justify-start items-center md:items-start w-full max-w-[540px] h-full p-2 pt-0 mt-3 md:mt-0">
			<div className="w-full h-auto mb-1">
				<h2 className="text-black-plusOne font-medium text-3xl text-center md:text-left w-full h-12 max-w-full truncate">
					{t("login.title")}
				</h2>
			</div>
			<div className="w-full h-full">
				<Alert
					label={data.message || i18n.t("error.unexpected")}
					variant={status === 401 ? "alert" : "error"}
				/>
				<div className="flex justify-end items-center mt-4">
					<Link to="/auth/login" className="text-black-minusOne text-sm hover:underline">
						{i18n.t("goBack")}
					</Link>
				</div>
			</div>
		</div>
	);
}

export default function Login() {
	const loaderData = useLoaderData<LoaderData>();
	const actionData = useActionData<ActionData>();
	const transition = useTransition();
	const i18n = useTranslation("common");
	const { t } = useTranslation("translation");

	return (
		<div className="flex flex-col justify-start items-center md:items-start w-full max-w-[540px] h-full p-2 pt-0 mt-3 md:mt-0">
			<div className="w-full h-auto mb-1">
				<h2 className="text-black-plusOne font-medium text-3xl text-center md:text-left w-full h-12 max-w-full truncate">
					{t("login.title")}
				</h2>
				{loaderData.redirectTo && (
					<p className="max-w-full text-xs truncate mb-3">
						Faça login para acessar: <strong>{loaderData.redirectTo}</strong>
					</p>
				)}
			</div>
			{actionData?.formError && (
				<div className="flex justify-center items-center w-full mb-5">
					<Alert {...actionData.formError} />
				</div>
			)}
			<div className="w-full h-fit bg-white-minusOne rounded-project p-5 shadow-sm">
				<Form method="post">
					<TextField
						name="email"
						label={t("login.email")}
						helperText={t("login.emailHelper")}
						isError={Boolean(actionData?.fieldErrors?.email)}
						errorMessage={actionData?.fieldErrors?.email}
					/>
					<TextField
						name="password"
						label={t("login.password")}
						isSensitive
						isError={Boolean(actionData?.fieldErrors?.password)}
						errorMessage={actionData?.fieldErrors?.password}
					/>
					<div className="flex justify-between items-center w-full px-1 pt-8">
						<Link
							to="/recuperar/senha"
							className="text-alt-blue text-xs hover:underline"
						>
							{t("form.passwordForgot")}
						</Link>
						<Button
							label={
								transition.state === "idle"
									? t("login.buttonName")
									: transition.state === "loading"
									? "Concluído!"
									: i18n.t("loading")
							}
							type="submit"
							disabled={transition.state === "submitting"}
						/>
					</div>
				</Form>
			</div>
		</div>
	);
}
