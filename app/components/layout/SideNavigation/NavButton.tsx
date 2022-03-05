import React, { memo, useEffect } from "react";
import type { FC } from "react";
import { NavLink, useLocation } from "remix";

export interface INavButtonProps {
	to: string;
	label: string;
	onActive?: (label: string) => void;
	alt?: boolean;
}

const NavButtonComponent: FC<INavButtonProps> = ({ to, label, onActive, alt }) => {
	const { pathname } = useLocation();

	useEffect(() => {
		if (pathname.split("/").includes(to) && onActive) onActive(label);
	}, [label, onActive, to, pathname]);

	return (
		<NavLink
			className={({ isActive }) => {
				return `${
					onActive && isActive ? "hidden" : "flex"
				} justify-center items-center min-w-[14rem] h-12 font-medium md:text-lg cursor-pointer 
				duration-200 rounded-project px-2 select-none ${
					isActive
						? "bg-white-minusTwo border border-black-main/10 hover:brightness-95"
						: alt
						? "bg-alt-red text-white-minusOne"
						: "bg-white-minusOne hover:brightness-90"
				}`;
			}}
			to={to}
			title={label}
			prefetch={alt ? "none" : "intent"}
		>
			{label}
		</NavLink>
	);
};
export const NavButton = memo(NavButtonComponent);
