import { createCookieSessionStorage, redirect } from "remix";
import type { Session } from "remix";
import { readSession, getUser } from "~/helpers/api/users/users.server";

const sessionToken = process.env.SESSION_TOKEN;
if (!sessionToken) throw new Error("O token secreto de sessão é necessário.");

export const storage = createCookieSessionStorage({
	cookie: {
		name: "ifal_session",
		secure: process.env.NODE_ENV === "production",
		secrets: [sessionToken],
		sameSite: "lax",
		path: "/",
		maxAge: 604800, // 7 dias
		httpOnly: true,
	},
});

export async function createSession(sessionId: string, redirectTo: string): Promise<Response> {
	const session = await storage.getSession();
	session.set("sessionId", sessionId);
	return redirect(redirectTo, {
		headers: {
			"Set-Cookie": await storage.commitSession(session),
		},
	});
}

export async function getSession(req: Request): Promise<Session> {
	return storage.getSession(req.headers.get("Cookie"));
}

export async function getSessionId(req: Request): Promise<string | null> {
	const session = await getSession(req);
	const sessionId = session.get("sessionId");
	if (!sessionId || typeof sessionId !== "string") return null;
	return sessionId;
}

export async function requireSession(req: Request, redirectTo: string): Promise<string> {
	const session = await getSession(req);
	const sessionId = session.get("sessionId");
	if (!sessionId || typeof sessionId !== "string") {
		const searchParams = new URLSearchParams([["continue", redirectTo]]);
		throw redirect(`/auth/login?${searchParams}`);
	}
	return sessionId;
}

export async function requireAdmin(req: Request, redirectTo: string): Promise<void> {
	const sessionId = await requireSession(req, redirectTo);
	const session = await readSession(sessionId);
	if (session.isError || !session.data) {
		const searchParams = new URLSearchParams([["continue", redirectTo]]);
		throw redirect(`/auth/login?${searchParams}`);
	}
	const user = await getUser(session.data.userId);
	if (user.isError || !user.data || user.data.profile.role !== "admin") {
		const searchParams = new URLSearchParams([["continue", redirectTo]]);
		throw redirect(`/auth/login?${searchParams}`);
	}
	return;
}
