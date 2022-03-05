import { LoaderFunction, redirect } from "remix";

export const loader: LoaderFunction = () => {
	return redirect("/exames/andamento");
};

export default function Index() {
	return null;
}
