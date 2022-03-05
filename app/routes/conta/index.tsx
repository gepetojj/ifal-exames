import { redirect } from "remix";
import type { LoaderFunction } from "remix";

export const loader: LoaderFunction = async () => {
	return redirect("/conta/dados", { status: 308 });
};

export default function Account() {
	return null;
}
