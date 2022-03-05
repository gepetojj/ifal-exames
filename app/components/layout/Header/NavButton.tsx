import React, { memo, useEffect } from "react";
import type { FC } from "react";
import { NavLink, useLocation } from "remix";

export interface INavButtonProps {
	to: string;
	label: string;
	onActive?: (label: string) => void;
}

const NavButtonComponent: FC<INavButtonProps> = ({ to, label, onActive }) => {
	const { pathname } = useLocation();

	useEffect(() => {
		if (pathname.split("/")[1] === to && onActive) onActive(label);
	}, [label, onActive, to, pathname]);

	return (
		<NavLink
			className={({ isActive }) => {
				return `${
					onActive && isActive ? "hidden" : "flex"
				} justify-center items-center min-w-[14rem] h-12 font-medium md:text-lg cursor-pointer 
				duration-200 rounded-t-project px-2 select-none ${
					isActive
						? "bg-primary-minusOne hover:brightness-110"
						: "bg-primary-minusOne/40 hover:brightness-[0.85]"
				}`;
			}}
			to={to}
			title={label}
			prefetch="intent"
		>
			{label}
		</NavLink>
	);
};
export const NavButton = memo(NavButtonComponent);
