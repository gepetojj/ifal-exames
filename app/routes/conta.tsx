import React, { useState } from "react";
import { Outlet } from "remix";
import type { LoaderFunction } from "remix";
import { SideNavigation } from "~/components/layout/SideNavigation";
import type { NavigationItem } from "~/entities/NavigationItem";
import { AuthProvider } from "~/providers/implementations/AuthProvider.server";

export const loader: LoaderFunction = async ({ request }) => {
	const authenticator = new AuthProvider().handler;
	await authenticator.isAuthenticated(request, {
		failureRedirect: "/auth/login?continue=/conta",
	});
	return null;
};

export default function AccountLayout() {
	const [items] = useState<NavigationItem[]>([
		{ to: "dados", label: "Dados pessoais" },
		{ to: "inscricoes", label: "Inscrições" },
		{ to: "conexoes", label: "Conexões" },
		{ to: "/auth/logout", label: "Desconectar", alt: true },
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
