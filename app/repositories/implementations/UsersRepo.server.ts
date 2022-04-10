import bcrypt from "bcrypt";
import { firestore } from "~/config/firebase.config.server";
import type { User, Account } from "~/entities/User";

import type { IUsersRepo } from "../IUsersRepo";

export class UsersRepo implements IUsersRepo {
	private collection: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>;

	constructor() {
		this.collection = firestore.collection("users");
	}

	async findByEmail(email: string): Promise<Account | null> {
		const query = await this.collection.where("email", "==", email).get();
		if (query.empty || !query.docs?.length) return null;
		return query.docs[0].data() as Account;
	}

	async emailExists(email: string): Promise<boolean> {
		const query = await this.collection.where("email", "==", email).get();
		if (query.empty || !query.docs?.length) return false;
		return true;
	}

	async findById(id: string): Promise<Account | null> {
		const query = await this.collection.doc(id).get();
		if (!query.exists || !query.data()) return null;
		return query.data() as Account;
	}

	async isUnlocked(id: string, userObj?: Account): Promise<boolean> {
		const user = userObj || (await this.findById(id));
		if (!user || !user.verified) return false;
		return true;
	}

	async createNew(user: User): Promise<void> {
		const emailVerification = await this.emailExists(user.email);
		if (emailVerification) throw new Error("Este email já existe. Tente novamente.");
		await this.collection.doc(user.id).create({
			...user,
			createdAt: new Date().valueOf(),
			updatedAt: 0,
			verified: false,
			verifiedAt: 0,
		});
	}

	async passwordMatches(
		id: string,
		passwordToCompare: string,
		userObj?: Account
	): Promise<boolean> {
		const user = userObj || (await this.findById(id));
		if (!user) return false;
		const matches = await bcrypt.compare(passwordToCompare, user.passwordHash);
		return matches;
	}
}
