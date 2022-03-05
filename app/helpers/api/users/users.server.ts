import { UserService } from "m3o/user";
import { redirect } from "remix";
import type { HandlerResponse } from "~/entities/HandlerResponse";
import type { Session as IFALSession } from "~/entities/Session";
import type { Account, UpdatableUser, User } from "~/entities/User";
import { storage } from "~/helpers/api/users/storage.server";

const m3oToken = process.env.M3O_TOKEN;
if (!m3oToken) throw new Error("O token de API para a M3O é necessário.");
const userService = new UserService(m3oToken);

export async function createUser(
	user: User,
	password: string
): Promise<HandlerResponse<undefined>> {
	try {
		await userService.create({ ...user, password });
		return {
			isError: false,
		};
	} catch (err) {
		return {
			isError: true,
			// @ts-expect-error (`Code` não existe em `err` mas é definido por `userService`.)
			errorCode: err.Code,
		};
	}
}

export async function login(
	email: User["email"],
	password: string
): Promise<HandlerResponse<IFALSession>> {
	try {
		const response = await userService.login({ email, password });

		if (!response.session) return { isError: true, errorCode: 401 };

		const session: IFALSession = {
			id: response.session.id,
			userId: response.session.userId,
			createdAt: response.session.created,
			expiresAt: response.session.expires,
		};

		return {
			isError: false,
			data: session,
		};
	} catch (err) {
		return {
			isError: true,
			// @ts-expect-error (`Code` não existe em `err` mas é definido por `userService`.)
			errorCode: err.Code,
		};
	}
}

export async function logout(request: Request): Promise<Response | null> {
	try {
		const session = await storage.getSession(request.headers.get("Cookie"));
		const sessionId: string = session.get("sessionId");
		if (!sessionId) return redirect("/auth/login");

		await userService.logout({ session_id: sessionId });
		return null;
	} catch (err) {
		return redirect("/auth/login?action=logout_failed");
	}
}

export async function readSession(
	sessionId: IFALSession["id"]
): Promise<HandlerResponse<IFALSession>> {
	try {
		const response = await userService.readSession({ session_id: sessionId });

		if (!response.session) return { isError: true, errorCode: 204 };

		const session: IFALSession = {
			id: response.session.id,
			userId: response.session.userId,
			createdAt: response.session.created,
			expiresAt: response.session.expires,
		};
		return {
			isError: false,
			data: session,
		};
	} catch (err) {
		return {
			isError: true,
			errorCode:
				// @ts-expect-error (`Code` não existe em `err` mas é definido por `userService`.)
				err.Code,
		};
	}
}

export async function sendPasswordResetEmail(email: string): Promise<HandlerResponse<undefined>> {
	try {
		await userService.sendPasswordResetEmail({
			from_name: "Contas do IFAL",
			subject: "Recuperação de senha - IFAL",
			text_content: `Olá ${email.split("@")[0]}!
			
			Um pedido de recuperação de senha foi emitido em sua conta.
			Para prosseguir, clique neste link: https://ifal.vercel.app/recuperar/senha/verificar?code=$code
			
			Caso você NÃO tenha feito este pedido, verifique a segurança da sua conta.
			Caso seja um erro, reporte isto ao IFAL por este email: dsi.copes@ifal.edu.br`,
			email,
		});
		return {
			isError: false,
		};
	} catch (err) {
		return {
			isError: true,
			// @ts-expect-error (`Code` não existe em `err` mas é definido por `userService`.)
			errorCode: err.Code,
		};
	}
}

export async function resetPassword(
	email: string,
	code: string,
	newPassword: string
): Promise<HandlerResponse<undefined>> {
	try {
		await userService.resetPassword({
			code,
			email,
			new_password: newPassword,
			confirm_password: newPassword,
		});
		return {
			isError: false,
		};
	} catch (err) {
		return {
			isError: true,
			// @ts-expect-error (`Code` não existe em `err` mas é definido por `userService`.)
			errorCode: err.Code,
		};
	}
}

export async function sendVerificationEmail(email: string): Promise<HandlerResponse<undefined>> {
	try {
		await userService.sendVerificationEmail({
			from_name: "Contas do IFAL",
			subject: "Confirmação de conta - IFAL",
			text_content: `Olá ${email.split("@")[0]}
			
			Uma conta foi criada no Sistema de Seleção do IFAL com seu email.
			Para ativar sua conta e poder usá-la, clique neste link: $micro_verification_link
			
			Caso você NÃO tenha feito este pedido, verifique se houveram vazamentos dos seus dados pessoais.
			Caso seja um erro, reporte isto ao IFAL por este email: dsi.copes@ifal.edu.br`,
			email,
			redirect_url: "https://ifal.vercel.app/auth/confirmar?success=true",
			failure_redirect_url: "https://ifal.vercel.app/auth/confirmar?success=false",
		});
		return { isError: false };
	} catch (err) {
		return {
			isError: true,
			// @ts-expect-error (`Code` não existe em `err` mas é definido por `userService`.)
			errorCode: err.Code,
		};
	}
}

export async function verifyEmail(token: string): Promise<HandlerResponse<undefined>> {
	try {
		await userService.verifyEmail({ token });
		return { isError: false };
	} catch (err) {
		return {
			isError: true,
			// @ts-expect-error (`Code` não existe em `err` mas é definido por `userService`.)
			errorCode: err.Code,
		};
	}
}

export async function updateUser(
	id: string,
	email?: string,
	data?: UpdatableUser
): Promise<HandlerResponse<undefined>> {
	try {
		await userService.update({ id, email, profile: data });
		return { isError: false };
	} catch (err) {
		return {
			isError: true,
			// @ts-expect-error (`Code` não existe em `err` mas é definido por `userService`.)
			errorCode: err.Code,
		};
	}
}

export async function getUser(userId: string): Promise<HandlerResponse<Account>> {
	try {
		const response = await userService.read({ id: userId });

		if (!response.account) return { isError: true, errorCode: 204 };

		const account: Account = {
			createdAt: response.account.created,
			updatedAt: response.account.updated,
			verified: response.account.verified,
			verifiedAt: response.account.verificationDate,
			id: response.account.id,
			username: response.account.username,
			email: response.account.email,
			profile: response.account.profile,
		};
		return { isError: false, data: account };
	} catch (err) {
		return {
			isError: true,
			// @ts-expect-error (`Code` não existe em `err` mas é definido por `userService`.)
			errorCode: err.Code,
		};
	}
}

export async function getUsers(
	limit?: number,
	offset?: number
): Promise<HandlerResponse<Account[]>> {
	try {
		const response = await userService.list({ limit, offset });

		if (!response.users || !response.users.length) return { isError: true, errorCode: 204 };

		const accounts: Account[] = [];
		for (const user of response.users) {
			const account: Account = {
				createdAt: user.created || 0,
				updatedAt: user.updated || 0,
				verified: user.verified || false,
				verifiedAt: user.verification_date || 0,
				id: user.id || "",
				username: user.username || "",
				email: user.email || "",
				// @ts-expect-error `Profile` será completo por `user.profile`.
				profile: user.profile || {},
			};
			accounts.push(account);
		}

		return { isError: false, data: accounts };
	} catch (err) {
		return {
			isError: true,
			// @ts-expect-error (`Code` não existe em `err` mas é definido por `userService`.)
			errorCode: err.Code,
		};
	}
}
