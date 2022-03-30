import React, { memo, useState } from "react";
import type { FC } from "react";
import { useAuth } from "~/components/context/AuthContext";
import type { NavigationItem } from "~/entities/NavigationItem";

import { NavButton } from "./NavButton";
import { NavDropdown } from "./NavDropdown";

const HeaderComponent: FC = props => {
	const [defaultItens] = useState<NavigationItem[]>([
		{ to: "exames", label: "Exames" },
		{ to: "auth", label: "Entrar" },
		{ to: "sac", label: "Perguntas frequentes" },
	]);
	const [authItens] = useState<NavigationItem[]>([
		{ to: "exames", label: "Exames", isRoleBased: false },
		{ to: "conta", label: "Sua conta", isRoleBased: false },
		{ to: "gerenciar", label: "Gerenciamento", isRoleBased: true },
		{ to: "sac", label: "Perguntas frequentes", isRoleBased: false },
	]);
	const { isLogged, user } = useAuth();

	return (
		<header className="flex flex-col w-screen h-auto bg-primary-main text-white-main">
			<div className="flex justify-between items-center p-6 pl-8 my-3 tablet:pl-16">
				<div className="flex items-center">
					<img
						width={80}
						height={93}
						src="/images/ifal-vertical-branca.webp"
						alt="Logo do IFAL"
					/>
					<h1 className="text-3xl font-semibold pl-8 print:text-black-main">
						Sistema de seleção
					</h1>
				</div>
				{isLogged && user && (
					<div className="hidden items-center h-full md:flex">
						<span className="text-sm pr-8">
							Olá{" "}
							<strong>
								{user.profile.fullName
									? user.profile.fullName.split(" ")[0]
									: user.username}
								!
							</strong>
						</span>
					</div>
				)}
			</div>
			<nav
				id="mobile-header"
				title="Menu para trocar a página"
				className="flex justify-center items-center w-full h-auto mb-4 md:hidden print:hidden"
			>
				<NavDropdown defaultItens={defaultItens} authItens={authItens} {...props} />
			</nav>
			<nav
				id="desktop-header"
				title="Menu para trocar a página"
				className="hidden md:flex flex-row justify-center items-center"
			>
				{isLogged
					? authItens
							.filter(item => item.isRoleBased === (user?.profile.role === "admin"))
							.map(item => <NavButton key={item.label.toLowerCase()} {...item} />)
					: defaultItens.map(item => (
							<NavButton key={item.label.toLowerCase()} {...item} />
					  ))}
			</nav>
		</header>
	);
};
export const Header = memo(HeaderComponent);
