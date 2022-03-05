import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import type { FC } from "react";
import { MdMenu } from "react-icons/md";

import { ISideNavigationProps } from ".";
import { NavButton } from "./NavButton";

const NavDropdownComponent: FC<ISideNavigationProps> = ({ itens }) => {
	const dropdownRef = useRef<HTMLDivElement>(null);
	const [isOpen, setIsOpen] = useState(false);
	const [activeItem, setActiveItem] = useState("Página");

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
			<span className="sr-only">Menu para trocar o tipo de página</span>
			<button
				className="flex relative justify-center items-center w-full max-w-[450px] font-medium
				md:text-lg h-12 duration-200 bg-white-minusTwo rounded-project hover:brightness-95"
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
					className="flex flex-col w-full max-w-[450px] border border-white-main/20 rounded-project 
					shadow"
				>
					{itens.map(item => (
						<NavButton key={item.label.toLowerCase()} {...item} onActive={setActive} />
					))}
				</div>
			</div>
		</div>
	);
};
export const NavDropdown = memo(NavDropdownComponent);
