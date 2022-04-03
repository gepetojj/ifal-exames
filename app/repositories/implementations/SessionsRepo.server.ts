import { firestore } from "~/config/firebase.config";
import type { Session } from "~/entities/Session";

import type { ISessionsRepo } from "../ISessionsRepo";

export class SessionsRepo implements ISessionsRepo {
	private collection: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>;

	constructor() {
		this.collection = firestore.collection("sessions");
	}

	async findById(id: string): Promise<Session | null> {
		const query = await this.collection.doc(id).get();
		if (!query.exists || !query.data()) return null;
		return query.data() as Session;
	}

	async findByUserId(userId: string): Promise<Session | null> {
		const query = await this.collection.where("userId", "==", userId).get();
		if (query.empty || !query.docs?.length) return null;
		return query.docs[0].data() as Session;
	}

	async isExpired(id: string): Promise<boolean> {
		const session = await this.findById(id);
		if (!session || session.revoked) return true;

		const now = new Date().valueOf();
		const expiresAt = session.expiresAt;
		if (now > expiresAt * 1000) return true;
		return false;
	}

	async createNew(session: Session): Promise<void> {
		await this.collection.doc(session.id).create(session);
	}

	async revoke(sessionId: string): Promise<void> {
		await this.collection.doc(sessionId).update({ revoked: true });
	}
}