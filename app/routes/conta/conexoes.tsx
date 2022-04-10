import React from "react";
import { useTranslation } from "react-i18next";
import { useLoaderData } from "remix";
import type { LoaderFunction } from "remix";
import { Alert } from "~/components/data/Alert";
import { Session } from "~/components/data/Session";
import { Session as ESession } from "~/entities/Session";
import { AuthProvider } from "~/providers/implementations/AuthProvider.server";
import { SessionsRepo } from "~/repositories/implementations/SessionsRepo.server";

interface LoaderData {
	currentSession: string;
	connections: ESession[];
}

export const loader: LoaderFunction = async ({ request }): Promise<LoaderData> => {
	const authenticator = new AuthProvider().handler;
	const sessionId = await authenticator.isAuthenticated(request, { failureRedirect: "/auth" });

	const sessionsRepo = new SessionsRepo();
	const currentSession = await sessionsRepo.findById(sessionId);
	if (!currentSession) return { currentSession: "", connections: [] };

	const sessions = await sessionsRepo.findByUserId(currentSession.userId);
	if (!sessions) return { currentSession: "", connections: [] };

	return { currentSession: sessionId, connections: sessions };
};

export default function AccountConnections() {
	const { currentSession, connections } = useLoaderData<LoaderData>();
	const { t } = useTranslation("translation");

	return (
		<div className="flex flex-col justify-start items-center md:items-start w-full max-w-[540px] h-full p-2 pt-0 mt-3 md:mt-0">
			<div className="w-full h-auto mb-1">
				<h2 className="text-black-plusOne font-medium text-3xl text-center md:text-left w-full h-12 max-w-full truncate">
					{t("account.connections.pageTitle")}
				</h2>
			</div>
			<div className="w-full h-full">
				{connections ? (
					<>
						{connections
							.filter(conn => !conn.revoked)
							.map(conn => (
								<Session
									key={conn.id}
									{...conn}
									isCurrent={currentSession === conn.id}
								/>
							))}
						{connections.find(conn => conn.revoked) && (
							<>
								<div className="mb-2">
									<span className="text-sm">
										{t("account.connections.inactive")}
									</span>
								</div>
								{connections
									.filter(conn => conn.revoked)
									.map(conn => (
										<Session key={conn.id} {...conn} />
									))}
							</>
						)}
					</>
				) : (
					<Alert label={t("account.connections.errors.notFound")} variant="error" />
				)}
			</div>
		</div>
	);
}
