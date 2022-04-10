import nProgress from "nprogress";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
	Outlet,
	useTransition,
	useCatch,
	useLocation,
	useLoaderData,
	Links,
	LiveReload,
	Meta,
	Scripts,
	ScrollRestoration,
	useMatches,
} from "remix";
import type { MetaFunction, LinksFunction, LoaderFunction, HeadersFunction } from "remix";
import { useSetupTranslations } from "remix-i18next";

import { AuthProvider as AuthProviderContext } from "./components/context/AuthContext";
import type { IAuthContext } from "./components/context/AuthContext";
import { ScrollToTop } from "./components/input/ScrollToTop";
import { Footer } from "./components/layout/Footer";
import { Header } from "./components/layout/Header";
import { Layout } from "./components/layout/Layout";
import { decrypt } from "./helpers/crypto.server";
import { remixI18next } from "./helpers/i18n.server";
import { webFont } from "./helpers/webfont.client";
import { AuthProvider } from "./providers/implementations/AuthProvider.server";
import { SessionsRepo } from "./repositories/implementations/SessionsRepo.server";
import { UsersRepo } from "./repositories/implementations/UsersRepo.server";
import styles from "./styles/globals.css";

interface LoaderData {
	locale: string;
	auth: IAuthContext;
	i18n: Record<string, object>;
	title: string;
	description: string;
}

export const loader: LoaderFunction = async ({ request }): Promise<LoaderData> => {
	const locale = await remixI18next.getLocale(request);
	const i18n = await remixI18next.getTranslations(request, ["common", "translation"]);
	const t = await remixI18next.getFixedT(request, "common");

	const title = t("title");
	const description = t("description");

	const authenticator = new AuthProvider().handler;
	const usersRepo = new UsersRepo();
	const sessionsRepo = new SessionsRepo();

	const sessionId = await authenticator.isAuthenticated(request);
	if (!sessionId) return { locale, auth: { isLogged: false }, i18n, title, description };

	const session = await sessionsRepo.findById(sessionId);
	const isSessionExpired = await sessionsRepo.isExpired(sessionId);
	if (!session || isSessionExpired) return { locale, auth: { isLogged: false }, i18n, title, description };

	const user = await usersRepo.findById(session.userId);
	if (!user) return { locale, auth: { isLogged: false }, i18n, title, description };

	return {
		locale,
		auth: {
			isLogged: true,
			user: {
				...user,
				passwordHash: "",
				profile: {
					...user.profile,
					cpf: decrypt(user.email, user.profile.cpf),
					cep: decrypt(user.email, user.profile.cep),
					state: decrypt(user.email, user.profile.state),
					city: decrypt(user.email, user.profile.city),
					neighborhood: decrypt(user.email, user.profile.neighborhood),
				},
			},
		},
		i18n,
		title,
		description,
	};
};

export const headers: HeadersFunction = ({ loaderHeaders }) => {
	return {
		"X-Ifal-Service": "exames",
		"Cache-Control": loaderHeaders.get("Cache-Control") || "max-age=300, s-maxage=3600",
		"Strict-Transport-Security": "max-age=604800; includeSubDomains; preload",
		"X-Content-Type-Options": "nosniff",
		"X-Frame-Options": "SAMEORIGIN",
		"X-XSS-Protection": "1; mode=block",
	};
};

export const meta: MetaFunction = ({ data }: { data: LoaderData }) => {
	const defaultTitle = data?.title || "Sistema de Seleção - IFAL";
	const defaultDesc =
		data?.description || "Participe de seleções em cursos do Instituto Federal de Alagoas.";
	const defaultUrl = "https://ifal.vercel.app/";
	const defaultImage = "/images/ifal-horizontal-colorida.png";
	const defaultImageAlt = "Logo do IFAL";
	const defaultColor = "#299626";

	return {
		title: defaultTitle,
		description: defaultDesc,
		"theme-color": defaultColor,
		"apple-mobile-web-app-capable": "yes",
		"apple-mobile-web-app-status-bar-style": "black-translucent",
		"apple-mobile-web-app-title": defaultTitle,
		"apple-touch-icon": "https://ifal.vercel.app/icons/standard/192.png",
		"mobile-web-app-capable": "yes",
		"msapplication-TileColor": defaultColor,
		"msapplication-tap-highlight": "no",
		"og:type": "website",
		"og:url": defaultUrl,
		"og:title": defaultTitle,
		"og:description": defaultDesc,
		"og:image": defaultImage,
		"og:image:alt": defaultImageAlt,
		"twitter:card": "summary_large_image",
		"twitter:url": defaultUrl,
		"twitter:title": defaultTitle,
		"twitter:description": defaultDesc,
		"twitter:image": defaultImage,
		"twitter:image:alt": defaultImageAlt,
	};
};

export const links: LinksFunction = () => {
	return [
		{
			rel: "icon",
			href: "/favicon.ico",
			type: "image/x-icon",
		},
		{
			rel: "manifest",
			href: "/manifest.webmanifest",
		},
		{
			rel: "stylesheet",
			href: styles,
		},
		{
			rel: "preconnect",
			href: "https://fonts.googleapis.com",
			crossOrigin: "anonymous",
		},
		{
			rel: "preload",
			href: "/images/ifal-vertical-branca.webp",
			as: "image",
			type: "image/png",
		},
	];
};

export function ErrorBoundary({ error }: { error: Error }) {
	const transition = useTransition();
	const { t } = useTranslation("common");

	useEffect(() => {
		nProgress.configure({
			showSpinner: false,
		});
		webFont.load({
			google: {
				families: ["Inter:300,400,500,600,700&display=swap"],
			},
		});
	}, []);

	useEffect(() => {
		if (transition.state === "idle") nProgress.done();
		else nProgress.start();
	}, [transition.state]);

	return (
		<Layout>
			<Header />
			<main className="flex flex-col w-full h-full">
				<img src="/images/ifal-errorwave.svg" alt="Imagem sinalizando erro" />
				<div className="flex justify-center items-center w-full h-full px-4">
					<div className="flex flex-col max-w-[26rem] h-auto bg-white-minusOne p-4 rounded-project">
						<h1 className="font-bold text-center">{t("error.detailsTitle")}</h1>
						<p className="text-sm leading-tight pt-2 break-words">
							{t("error.detailsDescription")}
						</p>
						<div className="pt-2">
							<h2 className="text-sm font-bold">{t("error.detailsSubtitle")}</h2>
							<div className="flex flex-col pt-1 pl-2">
								<p className="text-sm truncate">
									{t("error.code")} Erro inesperado
								</p>
								<p className="text-sm truncate">
									{t("error.path")} {error.message}
								</p>
							</div>
						</div>
					</div>
				</div>
			</main>
			<Footer />
		</Layout>
	);
}

export function CatchBoundary() {
	const caught = useCatch();
	const location = useLocation();
	const transition = useTransition();
	const { t } = useTranslation("common");

	useEffect(() => {
		nProgress.configure({
			showSpinner: false,
		});
		webFont.load({
			google: {
				families: ["Inter:300,400,500,600,700&display=swap"],
			},
		});
	}, []);

	useEffect(() => {
		if (transition.state === "idle") nProgress.done();
		else nProgress.start();
	}, [transition.state]);

	return (
		<Layout>
			<Header />
			<main className="flex flex-col w-full h-full">
				<img src="/images/ifal-errorwave.svg" alt="Imagem sinalizando erro" />
				<div className="flex justify-center items-center w-full h-full px-4">
					<div className="flex flex-col max-w-[26rem] h-auto bg-white-minusOne p-4 rounded-project">
						<h1 className="font-bold text-center">{t("error.detailsTitle")}</h1>
						<p className="text-sm leading-tight pt-2 break-words">
							{t("error.detailsDescription")}
						</p>
						<div className="pt-2">
							<h2 className="text-sm font-bold">{t("error.detailsSubtitle")}</h2>
							<div className="flex flex-col pt-1 pl-2">
								<p className="text-sm truncate">
									{t("error.code")} {caught.status}
								</p>
								<p className="text-sm truncate">
									{t("error.path")} {location.pathname}
								</p>
							</div>
						</div>
					</div>
				</div>
			</main>
			<Footer />
		</Layout>
	);
}

export default function App() {
	const { locale, auth } = useLoaderData<LoaderData>();
	const transition = useTransition();
	const matches = useMatches();
	useSetupTranslations(locale);

	useEffect(() => {
		nProgress.configure({
			showSpinner: false,
		});
		webFont.load({
			google: {
				families: ["Inter:300,400,500,600,700&display=swap"],
			},
		});
	}, []);

	useEffect(() => {
		if (transition.state === "idle") nProgress.done();
		else nProgress.start();
	}, [transition.state]);

	return (
		<html lang={locale}>
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width,initial-scale=1" />
				<Meta />
				{!!matches && (
					<link
						rel="canonical"
						href={`https://ifal.vercel.app${matches[matches.length - 1]?.pathname}`}
					/>
				)}
				<Links />
			</head>
			<body className="antialiased scroll-smooth overflow-x-hidden">
				<AuthProviderContext {...auth}>
					<Header />
					<Outlet />
					<Footer />
				</AuthProviderContext>
				<ScrollToTop />
				<ScrollRestoration />
				{process.env.NODE_ENV === "production" && (
					<script
						async
						defer
						src="https://scripts.simpleanalyticscdn.com/latest.js"
					></script>
				)}
				<Scripts />
				{process.env.NODE_ENV === "development" && <LiveReload />}
			</body>
		</html>
	);
}
