export interface Session {
	id: string;
	userId: string;
	createdAt: number;
	expiresAt: number;
	revoked: boolean;
}
