import { LoaderFunction, redirect } from "remix";
import { AuthProvider } from "~/providers/implementations/AuthProvider.server";

export const loader: LoaderFunction = async ({ request }) => {
	const authProvider = new AuthProvider();

	const sessionId = await authProvider.handler.isAuthenticated(request);
	if (!sessionId) return redirect("/auth/login");
	await authProvider.logout(sessionId);
	return await authProvider.handler.logout(request, { redirectTo: "/auth/login?action=logout" });
};

export default function Logout() {
	return null;
}
