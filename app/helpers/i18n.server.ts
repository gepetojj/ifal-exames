import fs from "fs";
import { RemixI18Next, FileSystemBackend } from "remix-i18next";

import { i18nOptions } from "../config/i18n.config";

// ! TESTING VERCEL FILE SYSTEM API

console.log("CWD: " + process.cwd());
console.log("DIRNAME: " + __dirname);
console.log("CWD FILES:" + fs.readdirSync(process.cwd()));
console.log("DIRNAME FILES: " + fs.readdirSync(__dirname));

const backend = new FileSystemBackend("./public/locales");

export const remixI18next = new RemixI18Next(backend, {
	fallbackLng: i18nOptions.fallbackLng as string,
	supportedLanguages: i18nOptions.supportedLngs as string[],
});
