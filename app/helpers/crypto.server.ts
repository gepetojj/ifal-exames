import cryptoJS from "crypto-js";

const encoder = cryptoJS.enc.Hex;
const keySize = 128 / 8;
const salt = process.env.CRYPTO_SALT;

export function encrypt(userKey: string, content: string): string {
	if (!salt) throw new Error("O salt para as operações criptográficas deve ser definido.");

	const key = cryptoJS.PBKDF2(userKey, salt, { keySize, iterations: 1000 });
	const result = cryptoJS.AES.encrypt(content, key.toString(encoder));
	return result.toString(cryptoJS.format.OpenSSL);
}

export function decrypt(userKey: string, content: string): string {
	if (!salt) throw new Error("O salt para as operações criptográficas deve ser definido.");

	const key = cryptoJS.PBKDF2(userKey, salt, { keySize, iterations: 1000 });
	const result = cryptoJS.AES.decrypt(content, key.toString(encoder));
	return result.toString(cryptoJS.enc.Utf8);
}
