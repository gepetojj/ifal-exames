import type { LoaderFunction } from "remix";
import { authenticator } from "~/helpers/api/users/auth.server";
import { logout } from "~/helpers/api/users/users.server";

export const loader: LoaderFunction = async ({ request }) => {
	await logout(request);
	return await authenticator.logout(request, { redirectTo: "/auth/login" });
};

export default function Logout() {
	return null;
}
