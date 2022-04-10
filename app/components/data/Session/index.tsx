import React, { memo } from "react";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "~/components/input/Button";
import { Session as ESession } from "~/entities/Session";
import { useTimestampToDate } from "~/hooks/useTimestampToDate";

export interface ISessionProps extends ESession {
	isCurrent?: boolean;
}

/**
 * Retorna os dados de uma sessão/conexão.
 *
 * @see {@link ISessionProps}
 *
 * @param {ESession} session Dados do exame. Este parâmetro deve ser desestruturado ao passar para este componente.
 * @param {boolean} isCurrent (Opcional) Quando ativado, informa ao usuário que é a sessão atual.
 */
const SessionComponent: FC<ISessionProps> = ({ createdAt, expiresAt, revoked, isCurrent }) => {
	const { t } = useTranslation("translation");

	const sessionCreatedAt = useTimestampToDate(createdAt);
	const sessionExpiresAt = useTimestampToDate(expiresAt);

	return (
		<div className="flex flex-col w-full h-fit bg-white-minusOne p-4 rounded-project mb-3 shadow-sm">
			<h3 className="text-xl font-bold truncate">
				Nome do navegador {isCurrent && t("account.connections.current")}
			</h3>
			<div className="flex flex-col w-full pt-1">
				<span className="text-sm truncate">
					{t("account.connections.os")} <strong>Nome do sistema operacional</strong>
				</span>
				<span className="text-sm truncate">
					{t("account.connections.createdAt")} <strong>{sessionCreatedAt}</strong>
				</span>
				<span className="text-sm truncate">
					{t("account.connections.expiresAt")} <strong>{sessionExpiresAt}</strong>
				</span>
				<span className="text-sm truncate">
					{t("account.connections.status")}{" "}
					<strong>
						{revoked
							? t("account.connections.revoked")
							: t("account.connections.active")}
					</strong>
				</span>
			</div>
			{!revoked && (
				<div className="flex justify-end w-full pt-1">
					<Button
						label={t("account.connections.logoff")}
						variant="red"
						href={isCurrent ? "/auth/logout" : undefined}
						prefetch={isCurrent ? false : true}
					/>
				</div>
			)}
		</div>
	);
};

export const Session = memo(SessionComponent);
