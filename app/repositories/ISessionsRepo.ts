import type { Session } from "~/entities/Session";

export interface ISessionsRepo {
	findById(id: string): Promise<Session | null>;
	findByUserId(userId: string): Promise<Session | null>;
	isExpired(id: string): Promise<boolean>;
	createNew(session: Session): Promise<void>;
	revoke(sessionId: string): Promise<void>;
}
