import React, { memo } from "react";
import type { FC } from "react";

const TwoSidesComponent: FC = ({ children }) => {
	return (
		<main
			className="flex flex-col tablet:items-center md:grid md:grid-cols-layout 
			md:gap-28 w-screen h-full min-h-screen bg-white-main text-black-main px-4 py-7 md:py-10"
		>
			{children}
		</main>
	);
};
export const TwoSides = memo(TwoSidesComponent);
