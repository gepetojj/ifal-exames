import React, { useState } from "react";
import { Outlet } from "remix";
import type { HeadersFunction } from "remix";
import { SideNavigation } from "~/components/layout/SideNavigation";
import type { NavigationItem } from "~/entities/NavigationItem";

export const headers: HeadersFunction = ({ loaderHeaders }) => {
	return {
		"Cache-Control": loaderHeaders.get("Cache-Control") || "max-age=300, s-maxage=3600",
	};
};

export default function AuthLayout() {
	const [items] = useState<NavigationItem[]>([
		{ to: "login", label: "Entrar" },
		{ to: "registrar", label: "Criar conta" },
	]);

	return (
		<main
			className="flex flex-col tablet:items-center md:grid md:grid-cols-layout 
			md:gap-28 w-screen h-full min-h-screen bg-white-main text-black-main px-4 py-7 md:py-10"
		>
			<SideNavigation itens={items} />
			<Outlet />
		</main>
	);
}
