import type { Account, User } from "~/entities/User";

export interface IUsersRepo {
	findByEmail(email: string): Promise<Account | null>;
	emailExists(email: string): Promise<boolean>;
	findById(id: string): Promise<Account | null>;
	isUnlocked(id: string, user?: Account): Promise<boolean>;
	createNew(user: User): Promise<void>;
	passwordMatches(id: string, passwordToCompare: string, user?: Account): Promise<boolean>;
	// getAll(): Promise<Account[]>;
	// update(id: string, data: UpdatableUser): Promise<void>;
	// changePassword(id: string, newPassword: string): Promise<void>;
}
