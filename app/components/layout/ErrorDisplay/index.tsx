import React, { memo } from "react";
import type { FC } from "react";
import { Alert } from "~/components/data/Alert";
import type { IAlertProps } from "~/components/data/Alert";

export interface IErrorDisplayProps extends IAlertProps {
	title: string;
}

const ErrorDisplayComponent: FC<IErrorDisplayProps> = ({ title, label, variant }) => {
	return (
		<div
			className="flex flex-col justify-start items-center md:items-start w-full
	max-w-[540px] h-full overflow-y-auto p-2 mt-3 md:mt-0"
		>
			<h2
				className="text-black-plusOne font-medium text-3xl text-center
		md:text-left mb-3 w-full h-12 max-w-full truncate"
			>
				{title}
			</h2>
			<Alert label={label} variant={variant} />
		</div>
	);
};
export const ErrorDisplay = memo(ErrorDisplayComponent);
