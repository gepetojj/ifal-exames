import React, { memo, useState } from "react";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "~/components/context/AuthContext";
import type { NavigationItem } from "~/entities/NavigationItem";

import { NavButton } from "./NavButton";
import { NavDropdown } from "./NavDropdown";

const HeaderComponent: FC = props => {
	const { t } = useTranslation("common");

	const [defaultItens] = useState<NavigationItem[]>([
		{ to: "exames", label: t("header.exams") },
		{ to: "auth", label: t("header.login") },
		{ to: "sac", label: t("header.faq") },
	]);
	const [authItens] = useState<NavigationItem[]>([
		{ to: "exames", label: t("header.exams"), isRoleBased: false },
		{ to: "conta", label: t("header.account"), isRoleBased: false },
		{ to: "gerenciar", label: t("header.manage"), isRoleBased: true },
		{ to: "sac", label: t("header.faq"), isRoleBased: false },
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
						alt={t("header.logo")}
					/>
					<h1 className="text-3xl font-semibold pl-8 print:text-black-main">
						{t("header.title")}
					</h1>
				</div>
				{isLogged && user && (
					<div className="hidden items-center h-full md:flex">
						<span className="text-sm pr-8">
							{t("header.greetings")}&nbsp;
							<strong>
								{user.profile.fullName
									? user.profile.fullName.split(" ")[0]
									: user.email}
								!
							</strong>
						</span>
					</div>
				)}
			</div>
			<nav
				id="mobile-header"
				title={t("header.navMenu")}
				className="flex justify-center items-center w-full h-auto mb-4 md:hidden print:hidden"
			>
				<NavDropdown defaultItens={defaultItens} authItens={authItens} {...props} />
			</nav>
			<nav
				id="desktop-header"
				title={t("header.navMenu")}
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
