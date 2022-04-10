import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { MdMenu } from "react-icons/md";
import { useAuth } from "~/components/context/AuthContext";
import type { NavigationItem } from "~/entities/NavigationItem";

import { NavButton } from "./NavButton";

export interface INavDropdownProps {
	items: NavigationItem[];
}

const NavDropdownComponent: FC<INavDropdownProps> = ({ items }) => {
	const dropdownRef = useRef<HTMLDivElement>(null);
	const [isOpen, setIsOpen] = useState(false);
	const [activeItem, setActiveItem] = useState("Página");
	const { isLogged, user } = useAuth();
	const { t } = useTranslation("common");

	const toggleVisibility = useCallback(() => {
		setIsOpen(isOpen => !isOpen);
	}, []);

	const setActive = useCallback((label: string) => {
		setActiveItem(label);
	}, []);

	useEffect(() => {
		const clickAwayListener = ({ target }: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(target as Node | null)) {
				setIsOpen(false);
			}
		};
		document.addEventListener("mousedown", clickAwayListener);
		return () => document.removeEventListener("mousedown", clickAwayListener);
	}, []);

	return (
		<div className="flex relative justify-center items-center w-full h-auto" ref={dropdownRef}>
			<span className="sr-only">{t("header.navMenu")}</span>
			<button
				className="flex relative justify-center items-center w-full max-w-[450px] font-medium
					md:text-lg h-12 mx-4 duration-200 bg-primary-minusOne rounded-project hover:brightness-110"
				type="button"
				onClick={toggleVisibility}
			>
				{activeItem}
				<MdMenu className="absolute right-4 text-2xl" />
			</button>
			<div
				className={`flex justify-center items-center absolute w-full h-auto transform 
					origin-top top-14 duration-100 ease-linear z-10 ${isOpen ? "scale-100" : "scale-0"}`}
			>
				<div
					className="flex flex-col w-full max-w-[450px] mx-4 border 
						border-white-main/20 rounded-project shadow bg-primary-main"
				>
					{isLogged
						? items
								.filter(item =>
									user?.profile.role === "admin" ? true : !item.isRoleBased
								)
								.filter(item => item.to !== "auth")
								.map(item => (
									<NavButton
										key={item.label.toLowerCase()}
										{...item}
										onActive={setActive}
									/>
								))
						: items
								.filter(item => !item.needsAuth)
								.map(item => (
									<NavButton
										key={item.label.toLowerCase()}
										{...item}
										onActive={setActive}
									/>
								))}
				</div>
			</div>
		</div>
	);
};
export const NavDropdown = memo(NavDropdownComponent);
