import { createCookieSessionStorage } from "remix";

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
