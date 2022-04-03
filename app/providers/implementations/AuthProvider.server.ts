import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { v4 as uuid } from "uuid";
import { storage } from "~/helpers/storage.server";
import { emailValidator } from "~/helpers/validators/email.server";
import { passwordValidator } from "~/helpers/validators/password.server";
import { SessionsRepo } from "~/repositories/implementations/SessionsRepo.server";
import { UsersRepo } from "~/repositories/implementations/UsersRepo.server";

import type { IAuthProvider } from "../IAuthProvider";

export class AuthProvider implements IAuthProvider {
	usersRepo: UsersRepo;
	sessionsRepo: SessionsRepo;
	handler: Authenticator<string>;

	constructor() {
		this.usersRepo = new UsersRepo();
		this.sessionsRepo = new SessionsRepo();
		this.handler = new Authenticator<string>(storage);
		this.handler.use(
			new FormStrategy(async ({ form }) => {
				const email = form.get("email")?.toString();
				const password = form.get("password")?.toString();

				const emailErr = emailValidator(email);
				const passwErr = passwordValidator(password);

				if (
					emailErr ||
					passwErr ||
					typeof email !== "string" ||
					typeof password !== "string"
				) {
					throw new Error("Preencha os campos de email e senha corretamente.");
				}

				const sessionId = await this.login(email, password);
				return sessionId;
			}),
			"login"
		);
	}

	async login(email: string, password: string): Promise<string> {
		const user = await this.usersRepo.findByEmail(email);
		if (!user || !this.usersRepo.isUnlocked(user.id, user)) {
			throw new Error("Usuário inexistente ou não foi verificado ainda.");
		}
		const passwordMatches = await this.usersRepo.passwordMatches(user.id, password, user);
		if (!passwordMatches) throw new Error("Verifique sua senha e tente novamente.");

		const sessionId = uuid();
		await this.sessionsRepo.createNew({
			id: sessionId,
			userId: user.id,
			createdAt: new Date().valueOf(),
			expiresAt: new Date().setDate(new Date().getDate() + 7).valueOf(), // Uma sessão tem 7 dias de duração.
			revoked: false,
		});
		return sessionId;
	}

	async logout(sessionId: string): Promise<void> {
		const session = await this.sessionsRepo.findById(sessionId);
		if (!session || session.revoked) {
			throw new Error("Sua sessão não existe ou foi revogada.");
		}
		await this.sessionsRepo.revoke(sessionId);
	}
}
