import React from "react";
import type { LoaderFunction } from "remix";
import { Alert } from "~/components/data/Alert";

export const loader: LoaderFunction = async () => {
	return null;
};

export default function AccountSubscriptions() {
	return (
		<div className="flex flex-col justify-start items-center md:items-start w-full max-w-[540px] h-full p-2 pt-0 mt-3 md:mt-0">
			<div className="w-full h-auto mb-1">
				<h2 className="text-black-plusOne font-medium text-3xl text-center md:text-left w-full h-12 max-w-full truncate">
					Inscrições
				</h2>
			</div>
			<Alert label="Em desenvolvimento." variant="info" />
		</div>
	);
}
