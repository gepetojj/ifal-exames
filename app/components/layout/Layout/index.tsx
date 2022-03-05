import React from "react";
import type { FC, ReactNode } from "react";
import { Meta, Links, LiveReload, Scripts, ScrollRestoration } from "remix";
import { ScrollToTop } from "~/components/input/ScrollToTop";

export interface ILayoutProps {
	lang?: string;
	InjectMeta?: ReactNode;
	InjectLinks?: ReactNode;
	InjectScripts?: ReactNode;
}

export const Layout: FC<ILayoutProps> = ({
	children,
	lang,
	InjectMeta,
	InjectLinks,
	InjectScripts,
}) => {
	return (
		<html lang={lang || "pt-br"}>
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width,initial-scale=1" />
				<Meta />
				{InjectMeta && InjectMeta}
				<Links />
				{InjectLinks && InjectLinks}
			</head>
			<body className="antialiased scroll-smooth overflow-x-hidden">
				{children}
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
				{InjectScripts && InjectScripts}
				{process.env.NODE_ENV === "development" && <LiveReload />}
			</body>
		</html>
	);
};
