import type { CleaveOptions } from "cleave.js/options";
import Cleave from "cleave.js/react";
import React, { memo, useCallback, useState, KeyboardEvent, FocusEvent } from "react";
import type { FC, InputHTMLAttributes, ChangeEvent } from "react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

export interface ITextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
	label: string;
	helperText?: string;
	isSensitive?: boolean;
	isError?: boolean;
	errorMessage?: string;
	options?: CleaveOptions;
	disableCleave?: boolean;
}

/**
 * Retorna um input de texto.
 *
 * @see {@link ITextFieldProps}
 *
 * @param {string} label Placeholder do input. Exemplo: `Email:`
 * @param {string} helperText (Opcional) Texto de ajuda do input, ficará abaixo dele. Exemplo: `Insira o email do titular da conta.`
 * @param {boolean} isSensitive (Opcional) Quando ativo, o input ficará como senha por padrão e poderá ser visualizado pelo botão
 * @param {boolean} isError (Opcional) Quando ativo, o input ficará em estado de erro
 * @param {string} errorMessage (Opcional) Quando existir, transformará o helperText (ou adicionará se não houver) com o texto inserido
 * @param {InputHTMLAttributes<HTMLInputElement>} props Props nativos do input também podem ser usados neste
 */
const TextFieldComponent: FC<ITextFieldProps> = ({
	label,
	helperText,
	isSensitive,
	isError,
	errorMessage,
	options,
	disableCleave,
	...props
}) => {
	const [isVisible, setIsVisible] = useState(!isSensitive);
	const [isFocused, setIsFocused] = useState(false);
	const [value, setValue] = useState(props.value || "");

	const toggleVisibility = useCallback(() => {
		setIsVisible(isVisible => !isVisible);
	}, []);

	const onFocus = useCallback(
		(event: FocusEvent<HTMLInputElement, Element>) => {
			setIsFocused(true);
			props.onFocus && props.onFocus(event);
		},
		[props]
	);

	const onBlur = useCallback(
		(event: FocusEvent<HTMLInputElement, Element>) => {
			setIsFocused(false);
			props.onBlur && props.onBlur(event);
		},
		[props]
	);

	const changeValue = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			setValue(event.target.value);
			props.onChange && props.onChange(event);
		},
		[props]
	);

	const keyboardHandler = useCallback(
		(event: KeyboardEvent<HTMLDivElement>) => {
			event.preventDefault();
			if (event.shiftKey && event.key === "S") toggleVisibility();
		},
		[toggleVisibility]
	);

	return (
		<div className="flex flex-col w-full max-w-[98vw] h-auto mb-1">
			<span
				className={`text-xs w-full relative top-[4px] pl-[6px] transition ease-in-out origin-left select-none duration-project ${
					isError ? "text-alt-red" : "text-black-plusOne"
				} ${isFocused || value || props.value ? "scale-100" : "scale-0"} ${
					props.disabled && "bg-white-minusFour rounded-t-[2px]"
				}`}
			>
				{label}
			</span>
			<div className="flex">
				{disableCleave ? (
					<input
						{...props}
						className={`w-full px-2 py-1 outline-none border-b bg-transparent transition duration-project
						disabled:bg-white-minusFour disabled:cursor-not-allowed
						${
							isError
								? "text-secondary-main placeholder-alt-red border-alt-red"
								: "text-black-plusOne placeholder-black-plusOne border-black-plusOne"
						} ${isSensitive ? "rounded-l-[2px]" : "rounded-[2px]"}`}
						type={isVisible ? "text" : "password"}
						placeholder={isFocused || value ? "" : label}
						spellCheck={false}
						onFocus={onFocus}
						onBlur={onBlur}
						onChange={changeValue}
					/>
				) : (
					<Cleave
						{...props}
						className={`w-full px-2 py-1 outline-none border-b bg-white-main/0 transition duration-project
						${
							isError
								? "text-secondary-main placeholder-alt-red border-alt-red"
								: "text-black-plusOne placeholder-black-plusOne border-black-plusOne"
						} ${isSensitive ? "rounded-l-[2px]" : "rounded-[2px]"}`}
						type={isVisible ? "text" : "password"}
						placeholder={isFocused || value ? "" : label}
						spellCheck={false}
						onFocus={onFocus}
						onBlur={onBlur}
						onChange={changeValue}
						options={options || {}}
					/>
				)}
				{isSensitive && (
					<div
						className={`flex justify-center items-center h-auto border-b rounded-r-[2px] pr-2
							${
								isError
									? "text-secondary-main border-alt-red"
									: "border-black-plusTwo hover:border-black-plusOne"
							}`}
						onClick={toggleVisibility}
						role="button"
						tabIndex={-1}
						onKeyDown={keyboardHandler}
					>
						{isVisible ? (
							<MdVisibilityOff className="text-xl" />
						) : (
							<MdVisibility className="text-xl" />
						)}
					</div>
				)}
			</div>
			{isError ? (
				<span className="text-[0.7rem] text-secondary-main px-2 pt-[0.3rem] w-full break-words">
					{errorMessage}
				</span>
			) : helperText ? (
				<span className="text-[0.7rem] text-black-plusTwo px-2 pt-[0.3rem] w-full break-words">
					{helperText}
				</span>
			) : null}
		</div>
	);
};
export const TextField = memo(TextFieldComponent);
