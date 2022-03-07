import React from "react";
import { hydrate } from "react-dom";
import { RemixBrowser } from "remix";

if ("serviceWorker" in navigator) {
	window.addEventListener("load", () => navigator.serviceWorker.register("/sw.js"));
}

hydrate(<RemixBrowser />, document);
