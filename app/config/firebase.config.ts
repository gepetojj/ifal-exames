import firebase from "firebase-admin";

const firebaseCert = process.env.FIREBASE_CERT;
if (!firebaseCert) throw new Error("Certificado de autenticação do firebase é necessário.");

const parsedCert = JSON.parse(firebaseCert);
parsedCert.privateKey = parsedCert.privateKey.replace(/\\n/g, "\n");

if (!firebase.apps.length) {
	firebase.initializeApp({
		credential: firebase.credential.cert(parsedCert),
		databaseURL: "https://ifalrework.firebaseio.com",
	});
}

export const firestore = firebase.firestore();
export const storage = firebase.storage();
