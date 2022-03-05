import React, { memo } from "react";
import type { FC } from "react";
import type { IconType } from "react-icons";
import { BiLinkExternal } from "react-icons/bi";
import { BsYoutube, BsInstagram, BsTwitter, BsGithub } from "react-icons/bs";
import { MdFacebook, MdEmail } from "react-icons/md";

interface ILinkProps {
	label: string;
	Icon: IconType;
	to: string;
}

const Link: FC<ILinkProps> = ({ label, Icon, to }) => {
	return (
		<a
			className="flex justify-center footer:justify-start items-center w-full my-1 footer:my-0 text-white-minusOne select-none"
			href={to}
			target="_blank"
			rel="noreferrer"
		>
			<Icon />
			<span className="pl-2 truncate hover:underline">{label}</span>
		</a>
	);
};

const FooterComponent: FC = () => {
	return (
		<footer className="flex flex-col w-screen h-auto bg-primary-main p-8 mt-5">
			<div className="flex flex-col footer:flex-row mb-2">
				<div className="flex flex-col w-full footer:w-1/2">
					<div className="flex justify-center tablet:justify-start items-center w-full">
						<img
							width={244}
							height={86}
							src="/images/ifal-horizontal-branca.png"
							alt="Logo horizontal do IFAL"
						/>
					</div>
				</div>
				<div className="flex flex-col footer:flex-row justify-center footer:justify-end w-full mt-4 footer:mt-0 footer:w-1/2 pt-3">
					<div className="mx-4">
						<h2 className="text-black-plusOne mb-2 font-medium text-center truncate">
							Mídias sociais
						</h2>
						<Link
							label="Youtube"
							to="https://youtube.com/ifaloficial"
							Icon={BsYoutube}
						/>
						<Link
							label="Instagram"
							to="https://instagram.com/ifal.oficial"
							Icon={BsInstagram}
						/>
						<Link
							label="Twitter"
							to="https://twitter.com/ifal_oficial"
							Icon={BsTwitter}
						/>
						<Link
							label="Facebook"
							to="https://facebook.com/ifal.oficial"
							Icon={MdFacebook}
						/>
					</div>
					<div className="mx-4 mt-4 footer:mt-0">
						<h2 className="text-black-plusOne mb-2 font-medium text-center truncate">
							Relacionados
						</h2>
						<Link
							label="Site original"
							to="https://exame.ifal.edu.br"
							Icon={BiLinkExternal}
						/>
						<Link label="Blog" to="https://www2.ifal.edu.br" Icon={BiLinkExternal} />
						<Link
							label="Veja o projeto"
							to="https://github.com/gepetojj/ifal-exames"
							Icon={BsGithub}
						/>
					</div>
					<div className="mx-4 mt-4 footer:mt-0">
						<h2 className="text-black-plusOne mb-2 font-medium text-center truncate">
							Contatos
						</h2>
						<Link label="DSI" to="mailto:dsi.copes@ifal.edu.br" Icon={MdEmail} />
						<Link
							label="Pós Graduação"
							to="mailto:posgraduacao@ifal.edu.br"
							Icon={MdEmail}
						/>
					</div>
				</div>
			</div>
			<div className="flex flex-col justify-center items-center w-full text-white-main text-sm h-1/4 mt-10">
				<a
					className="mb-1 select-none text-center hover:underline"
					href="https://github.com/gepetojj"
					target="_blank"
					rel="noreferrer"
				>
					© 2021 - Gepetojj
				</a>
				<a
					className="break-words min-w-[215px] select-none text-center hover:underline"
					href="https://dti.ifal.edu.br"
					target="_blank"
					rel="noreferrer"
				>
					Originalmente por Diretoria de Tecnologia da Informação - IFAL
				</a>
			</div>
		</footer>
	);
};
export const Footer = memo(FooterComponent);
