import algoliaSearch from "algoliasearch/lite";
import qs from "qs";
import React, { useEffect, useRef, useState } from "react";
import type { SearchState } from "react-instantsearch-core";
import {
	InstantSearch,
	SearchBox,
	Pagination,
	Highlight,
	Configure,
	connectHits,
	PoweredBy,
} from "react-instantsearch-dom";
import { useCatch, useLoaderData } from "remix";
import type { MetaFunction, LoaderFunction } from "remix";
import { Alert } from "~/components/data/Alert";
import { Dropdown } from "~/components/data/Dropdown";
import { ErrorDisplay } from "~/components/layout/ErrorDisplay";

interface LoaderData {
	algoliaApp: string;
	algoliaToken: string;
	query?: string;
	page?: number;
}

export const meta: MetaFunction = () => {
	const title = "Perguntas Frequentes - IFAL";
	const description = "Tire suas dúvidas e não cometa erros em inscrições.";
	const url = "https://ifal.vercel.app/sac";

	return {
		title,
		description,
		"og:title": title,
		"og:description": description,
		"og:url": url,
		"twitter:title": title,
		"twitter:description": description,
		"twitter:url": url,
	};
};

export const loader: LoaderFunction = async ({ request }) => {
	const url = new URL(request.url);
	const query = url.searchParams.get("query") || "";
	const page = url.searchParams.get("page") || 1;
	const algoliaApp = process.env.PUBLIC_ALGOLIA_APP;
	const algoliaToken = process.env.PUBLIC_ALGOLIA_SEARCH_TOKEN;

	if (!algoliaApp || !algoliaToken) throw new Error("O app e token Algolia são necessários.");

	return { algoliaApp, algoliaToken, query, page: Number(page) || 1 };
};

export function CatchBoundary() {
	const caught = useCatch();

	switch (caught.status) {
		case 404:
			return (
				<div className="flex justify-center items-center w-full pt-7">
					<ErrorDisplay title="Perguntas Frequentes" label={caught.data} />
				</div>
			);

		case 503:
			return (
				<div className="flex justify-center items-center w-full pt-7">
					<ErrorDisplay
						title="Perguntas Frequentes"
						label="O servidor está offline. Tente novamente mais tarde."
						variant="error"
					/>
				</div>
			);

		default:
			return (
				<div className="flex justify-center items-center w-full pt-7">
					<ErrorDisplay
						title="Houve um erro"
						label="Houve um erro. Recarregue para tentar novamente."
						variant="error"
					/>
				</div>
			);
	}
}

const Hits = connectHits(({ hits }) => {
	return (
		<ul>
			{hits.length ? (
				hits.map(hit => (
					<li key={hit.objectID}>
						<article className="w-full h-full my-2">
							<Dropdown
								title={<Highlight attribute="question" hit={hit} />}
								content={hit.answer}
							/>
						</article>
					</li>
				))
			) : (
				<Alert label="Sua pesquisa não encontrou resultados." variant="alert" />
			)}
		</ul>
	);
});

export default function Sac() {
	const { algoliaApp, algoliaToken, query, page } = useLoaderData<LoaderData>();
	const searchClient = useState(algoliaSearch(algoliaApp, algoliaToken))[0];
	const [searchState, setSeachState] = useState<SearchState>({ query, page });
	const debouncedSetState = useRef<NodeJS.Timeout>(
		setTimeout(() => {
			return;
		}, 0)
	);

	const onSearchStateChange = ({ query, page }: SearchState) => {
		clearTimeout(debouncedSetState.current);
		debouncedSetState.current = setTimeout(() => {
			window.history.pushState(
				{ query, page },
				"",
				query || page ? `${window.location.pathname}?${qs.stringify({ query, page })}` : ""
			);
		}, 200);
		setSeachState({ query, page });
	};

	useEffect(() => {
		const onPopState = ({ state }: PopStateEvent) => {
			setSeachState(state || {});
		};
		window.addEventListener("popstate", onPopState);

		return () => {
			clearTimeout(debouncedSetState.current);
			window.removeEventListener("popstate", onPopState);
		};
	}, []);

	return (
		<main
			className="flex flex-col justify-start items-center w-screen
			h-full min-h-screen bg-white-main text-black-main px-4 py-7 md:py-10"
		>
			<div className="flex flex-col justify-center items-center w-full max-w-[650px] h-auto">
				<div className="max-w-full mb-3">
					<h1 className="text-center md:text-left font-medium text-3xl truncate">
						Perguntas Frequentes
					</h1>
				</div>
				<InstantSearch
					indexName="dev_FAQ"
					searchClient={searchClient}
					searchState={searchState}
					onSearchStateChange={onSearchStateChange}
					createURL={searchState => (searchState ? `?${qs.stringify(searchState)}` : "")}
				>
					<Configure hitsPerPage={10} />
					<div className="w-full h-full">
						<SearchBox
							translations={{
								submitTitle: "Pesquisar",
								resetTitle: "Limpar pesquisa",
								placeholder: "Pesquise:",
							}}
						/>
					</div>
					<div className="w-full pt-2">
						<PoweredBy
							translations={{
								searchBy: "Pesquisas por:",
							}}
						/>
					</div>
					<div className="w-full h-full py-2">
						<Hits />
						<Pagination
							padding={4}
							showFirst={false}
							translations={{
								ariaPrevious: "Página anterior",
								ariaNext: "Próxima página",
								ariaFirst: "Primeira página",
								ariaLast: "Última página",
							}}
						/>
					</div>
				</InstantSearch>
			</div>
		</main>
	);
}
