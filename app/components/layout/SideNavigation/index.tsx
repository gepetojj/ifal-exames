import React, { memo } from "react";
import type { FC } from "react";
import { NavLink } from "remix";
import type { NavigationItem } from "~/entities/NavigationItem";

import { NavDropdown } from "./NavDropdown";

export interface ISideNavigationProps {
	itens: NavigationItem[];
}

const SideNavigationComponent: FC<ISideNavigationProps> = ({ itens }) => {
	return (
		<>
			<nav
				id="mobile-side-navigation"
				className="flex justify-center items-center w-full h-auto md:hidden print:hidden"
			>
				<NavDropdown itens={itens} />
			</nav>
			<nav
				id="desktop-side-navigation"
				className="hidden md:flex flex-col w-full h-full justify-start items-end"
			>
				<aside className="flex flex-col border border-white-minusOne rounded-project p-2">
					{itens.map(item => (
						<NavLink
							key={item.label.toLowerCase()}
							to={item.to}
							prefetch={item.alt ? "none" : "intent"}
							className={({ isActive }) =>
								`flex justify-center items-center my-1 w-40 h-9 select-none font-medium
								${
									item.alt
										? "bg-alt-red text-white-minusOne"
										: "bg-white-minusTwo text-black-plusTwo"
								} rounded-project hover:brightness-95 
								duration-200 ${isActive ? "border-black-main/20 border" : ""}`
							}
						>
							{item.label}
						</NavLink>
					))}
				</aside>
			</nav>
		</>
	);
};
export const SideNavigation = memo(SideNavigationComponent);
