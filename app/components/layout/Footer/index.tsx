import React, { memo } from "react";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import type { IconType } from "react-icons";
import { BiLinkExternal } from "react-icons/bi";
import { BsYoutube, BsInstagram, BsTwitter, BsGithub } from "react-icons/bs";
import { MdFacebook, MdEmail } from "react-icons/md";
import { LanguageSelector } from "~/components/input/LanguageSelector";

interface ILinkProps {
	label: string;
	Icon: IconType;
	to: string;
}

const Link: FC<ILinkProps> = ({ label, Icon, to }) => {
	return (
		<a
			className="flex justify-center footer:justify-start items-center w-full h-10 footer:h-fit footer:py-1 text-white-minusOne select-none"
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
	const { t } = useTranslation("common");

	return (
		<footer className="flex flex-col w-screen h-auto bg-primary-main p-8 mt-5">
			<div className="flex flex-col footer:flex-row mb-2">
				<div className="flex flex-col w-full footer:w-1/2">
					<div className="flex justify-center tablet:justify-start items-center w-full">
						<img
							width={244}
							height={86}
							src="/images/ifal-horizontal-branca.webp"
							alt={t("footer.logo")}
						/>
					</div>
					<div className="flex justify-center items-center w-full pt-2 lg:justify-start">
						<LanguageSelector />
					</div>
				</div>
				<div className="flex flex-col footer:flex-row justify-center footer:justify-end w-full mt-4 footer:mt-0 footer:w-1/2 pt-3">
					<div className="px-2">
						<h2 className="text-black-plusOne mb-2 font-medium text-center truncate">
							{t("footer.socialMedia")}
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
					<div className="px-2 mt-4 footer:mt-0">
						<h2 className="text-black-plusOne mb-2 font-medium text-center truncate">
							{t("footer.related.title")}
						</h2>
						<Link
							label={t("footer.related.originalWebsite")}
							to="https://exame.ifal.edu.br"
							Icon={BiLinkExternal}
						/>
						<Link
							label={t("footer.related.blog")}
							to="https://www2.ifal.edu.br"
							Icon={BiLinkExternal}
						/>
						<Link
							label={t("footer.related.goToProject")}
							to="https://github.com/gepetojj/ifal-exames"
							Icon={BsGithub}
						/>
					</div>
					<div className="px-2 mt-4 footer:mt-0">
						<h2 className="text-black-plusOne mb-2 font-medium text-center truncate">
							{t("footer.contact.title")}
						</h2>
						<Link
							label={t("footer.contact.dsi")}
							to="mailto:dsi.copes@ifal.edu.br"
							Icon={MdEmail}
						/>
						<Link
							label={t("footer.contact.postgraduate")}
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
					{t("footer.copyright", { year: new Date().getFullYear() })}
				</a>
				<a
					className="break-words min-w-[215px] select-none text-center hover:underline"
					href="https://dti.ifal.edu.br"
					target="_blank"
					rel="noreferrer"
				>
					{t("footer.credits")}
				</a>
			</div>
		</footer>
	);
};
export const Footer = memo(FooterComponent);
