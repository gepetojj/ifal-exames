import nProgress from "nprogress";
import React, { useEffect } from "react";
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
} from "remix";
import type { MetaFunction, LinksFunction, LoaderFunction, HeadersFunction } from "remix";

import { AuthProvider } from "./components/context/AuthContext";
import type { IAuthContext } from "./components/context/AuthContext";
import { ScrollToTop } from "./components/input/ScrollToTop";
import { Footer } from "./components/layout/Footer";
import { Header } from "./components/layout/Header";
import { Layout } from "./components/layout/Layout";
import { authenticator } from "./helpers/api/users/auth.server";
import { getUser, readSession } from "./helpers/api/users/users.server";
import { webFont } from "./helpers/webfont.client";
import styles from "./styles/globals.css";

export const loader: LoaderFunction = async ({ request }) => {
	if (process.env.NODE_ENV === "development") return { isLogged: false };

	const sessionId = await authenticator.isAuthenticated(request);
	if (sessionId) {
		const session = await readSession(sessionId);
		if (session.isError || session.data === undefined) return { isLogged: false };
		const user = await getUser(session.data?.userId);
		if (user.isError || user.data === undefined) return { isLogged: false };
		return { isLogged: true, user: user.data };
	}
	return { isLogged: false };
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

export const meta: MetaFunction = () => {
	const defaultTitle = "Sistema de Seleção - IFAL";
	const defaultDesc = "Participe de seleções em cursos do Instituto Federal de Alagoas.";
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
		"apple-touch-icon": "/icons/standard/192.png",
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
			rel: "preload",
			href: "/images/ifal-vertical-branca.png",
			as: "image",
			type: "image/png",
		},
	];
};

export function ErrorBoundary({ error }: { error: Error }) {
	return (
		<Layout>
			<Header />
			<main className="flex flex-col w-full h-full">
				<img src="/images/ifal-errorwave.svg" alt="Imagem sinalizando erro" />
				<div className="flex justify-center items-center w-full h-full px-4">
					<div className="flex flex-col max-w-[26rem] h-auto bg-white-minusOne p-4 rounded-project">
						<h1 className="font-bold text-center">Ocorreu um erro nesta página.</h1>
						<p className="text-sm leading-tight pt-2 break-words">
							Caso esteja enfrentando problemas técnicos, entre em contato com nossa
							equipe, por meio das redes sociais ou por email.
						</p>
						<div className="pt-2">
							<h2 className="text-sm font-bold">Detalhes técnicos:</h2>
							<div className="flex flex-col pt-1 pl-2">
								<p className="text-sm truncate">Código do erro: Erro inesperado</p>
								<p className="text-sm truncate">
									Mensagem do erro: {error.message}
								</p>
							</div>
						</div>
					</div>
				</div>
			</main>
		</Layout>
	);
}

export function CatchBoundary() {
	const caught = useCatch();
	const location = useLocation();

	return (
		<Layout>
			<Header />
			<main className="flex flex-col w-full h-full">
				<img src="/images/ifal-errorwave.svg" alt="Imagem sinalizando erro" />
				<div className="flex justify-center items-center w-full h-full px-4">
					<div className="flex flex-col max-w-[26rem] h-auto bg-white-minusOne p-4 rounded-project">
						<h1 className="font-bold text-center">Ocorreu um erro nesta página.</h1>
						<p className="text-sm leading-tight pt-2 break-words">
							Caso esteja enfrentando problemas técnicos, entre em contato com nossa
							equipe, por meio das redes sociais ou por email.
						</p>
						<div className="pt-2">
							<h2 className="text-sm font-bold">Detalhes técnicos:</h2>
							<div className="flex flex-col pt-1 pl-2">
								<p className="text-sm truncate">Código do erro: {caught.status}</p>
								<p className="text-sm truncate">
									Caminho do erro: {location.pathname}
								</p>
							</div>
						</div>
					</div>
				</div>
			</main>
		</Layout>
	);
}

export default function App() {
	const authState = useLoaderData<IAuthContext>();
	const transition = useTransition();

	useEffect(() => {
		nProgress.configure({
			showSpinner: false,
		});
		webFont.load({
			google: {
				families: ["Inter:300,400,500,600,700"],
			},
		});
	}, []);

	useEffect(() => {
		if (transition.state === "idle") nProgress.done();
		else nProgress.start();
	}, [transition.state]);

	return (
		<html lang="pt-br">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width,initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body className="antialiased scroll-smooth overflow-x-hidden">
				<AuthProvider {...authState}>
					<Header />
					<Outlet />
					<Footer />
				</AuthProvider>
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
