import { redirect } from "remix";
import type { MetaFunction, LoaderFunction } from "remix";

export const meta: MetaFunction = () => {
	const description =
		"O IFAL disponibiliza exames afim de selecionar pessoas para vagas que a instituição oferece.";
	return {
		description,
		"og:description": description,
		"twitter:description": description,
	};
};

export const loader: LoaderFunction = () => {
	return redirect("/exames/andamento", { status: 308 });
};

export default function Exams() {
	return null;
}
