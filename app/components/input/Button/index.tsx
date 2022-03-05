import React, { memo } from "react";
import type { FC, ButtonHTMLAttributes } from "react";
import { Link } from "remix";

export interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	label: string;
	variant?: "red" | "green" | "blue";
	isFull?: boolean;
	href?: string;
}

/**
 * Retorna um botão.
 *
 * @see {@link IButtonProps}
 *
 * @param {string} label Texto do botão. Exemplo: `Inscreva-se`
 * @param {IButtonProps["variant"]} variant (Opcional; O padrão é `green`) Variante do botão. Pode ser `red`, `green` ou `blue`
 * @param {boolean} isFull (Opcional) Quando ativado, o botão passará a oculpar todo o campo X do seu pai
 * @param {string} href (Opcional) Quando algo é especificado, o botão se torna um link, mas mantém toda sua estilização padrão
 * @param {ButtonHTMLAttributes<HTMLButtonElement>} props Props existentes em um botão nativo também podem ser passadas para este
 */
const ButtonComponent: FC<IButtonProps> = ({ label, variant, isFull, href, ...props }) => {
	const classes = `flex justify-center items-center ${isFull ? "w-full" : "min-w-[7.5rem]"}
	h-8 text-white-main text-sm font-medium shadow-sm duration-200 select-none rounded-project 
	truncate px-1 hover:brightness-95 disabled:brightness-75 disabled:cursor-not-allowed
	${variant === "red" ? "bg-alt-red" : variant === "blue" ? "bg-alt-blue" : "bg-primary-main"}`;

	if (href) {
		return (
			<Link to={href} prefetch="intent" className={classes}>
				{label}
			</Link>
		);
	}

	return (
		<button {...props} className={classes}>
			{label}
		</button>
	);
};
export const Button = memo(ButtonComponent);
