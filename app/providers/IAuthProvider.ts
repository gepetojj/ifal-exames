import { Authenticator } from "remix-auth";

export interface IAuthProvider {
	handler: Authenticator<string>;

	login(email: string, password: string): Promise<string>;
	logout(sessionId: string): Promise<void>;
}
