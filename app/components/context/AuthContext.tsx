import React, { createContext, memo, useContext } from "react";
import type { FC } from "react";
import type { Account } from "~/entities/User";

export interface IAuthContext {
	isLogged: boolean;
	user?: Account;
}

const Context = createContext<IAuthContext>({ isLogged: false });

/**
 * Provedor do contexto de login.
 *
 * @see {@link IAuthContext}
 *
 * @param {ChildNode} children Parte do app que será encapsulado com o contexto
 * @param {IAuthContext} value Dados para serem injetados no contexto
 */
const AuthProviderComponent: FC<IAuthContext> = ({ children, isLogged, user }) => {
	return <Context.Provider value={{ isLogged, user }}>{children}</Context.Provider>;
};
export const AuthProvider = memo(AuthProviderComponent);

/**
 * Hook que retorna os dados do contexto de login do usuário.
 *
 * @see {@link IAuthContext}
 *
 * @returns {IAuthContext} Contexto de login
 */
export const useAuth = (): IAuthContext => {
	const context = useContext(Context);
	return context;
};
