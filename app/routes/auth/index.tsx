import { redirect } from "remix";
import type { LoaderFunction, MetaFunction } from "remix";

export const meta: MetaFunction = () => {
	const description =
		"Entre em sua conta do IFAL, ou crie uma nova para poder participar de seleções.";
	return {
		description,
		"og:description": description,
		"twitter:description": description,
	};
};

export const loader: LoaderFunction = () => {
	return redirect("/auth/login", { status: 308 });
};

export default function Auth() {
	return null;
}
