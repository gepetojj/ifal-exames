import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { emailValidator } from "~/helpers/validators/email.server";
import { passwordValidator } from "~/helpers/validators/password.server";

import { storage } from "./storage.server";
import { login } from "./users.server";

export const authenticator = new Authenticator<string>(storage);

authenticator.use(
	new FormStrategy(async ({ form }) => {
		const email = form.get("email")?.toString();
		const password = form.get("password")?.toString();

		const emailErr = emailValidator(email);
		const passwErr = passwordValidator(password);

		if (emailErr || passwErr || typeof email !== "string" || typeof password !== "string") {
			throw new Error("Preencha os campos Email e Senha corretamente.");
		}

		const session = await login(email, password);
		if ((session.isError && session.errorCode) || !session.data) {
			switch (session.errorCode) {
				case 401:
					throw new Error("Email ou senha inválidos.");

				case 500:
					throw new Error("Houve um erro. Verifique seu email.");

				default:
					throw new Error("Houve um erro. Verifique seu email.");
			}
		}

		return session.data.id;
	}),
	"login"
);
