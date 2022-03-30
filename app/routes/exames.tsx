import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Outlet } from "remix";
import { SideNavigation } from "~/components/layout/SideNavigation";
import type { NavigationItem } from "~/entities/NavigationItem";

export default function ExamsLayout() {
	const { t } = useTranslation("common");
	const [items] = useState<NavigationItem[]>([
		{ to: "andamento", label: t("uppercase.ongoing") },
		{ to: "futuros", label: t("uppercase.future") },
		{ to: "encerrados", label: t("uppercase.closed") },
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
