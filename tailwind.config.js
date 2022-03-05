module.exports = {
	content: ["./app/**/*.{ts,tsx}"],
	theme: {
		colors: {
			transparent: "#00000000",
			primary: {
				main: "#299626",
				plusOne: "#34bf30",
				plusTwo: "#53d350",
				plusThree: "#7bdd79",
				plusFour: "#a3e7a1",
				minusOne: "#1e6e1c",
				minusTwo: "#134512",
				minusThree: "#081c07",
			},
			secondary: {
				main: "#c90015",
				plusOne: "#fa001a",
				plusTwo: "#ff2e44",
				plusThree: "#ff6171",
				plusFour: "#ff949f",
				minusOne: "#94000f",
				minusTwo: "#61000a",
				minusThree: "#2e0005",
			},
			black: {
				main: "#000000",
				plusOne: "#191919",
				plusTwo: "#333333",
				plusThree: "#4c4c4c",
			},
			white: {
				main: "#ffffff",
				minusOne: "#f1f1f1",
				minusTwo: "#ebebeb",
				minusThree: "#e5e5e5",
				minusFour: "#e0e0e0",
			},
			alt: {
				blue: "#698fda",
				green: "#67da6c",
				yellow: "#dfea5d",
				red: "#da6767",
			},
		},
		fontFamily: {
			body: "'Inter', sans-serif",
			sans: "'Inter', sans-serif",
		},
		extend: {
			gridTemplateColumns: {
				layout: "0.95fr 1.5fr",
			},
			animation: {
				"spin-slow": "spin 1.5s linear infinite",
			},
			screens: {
				mobile: "661px",
				tablet: "573px",
				footer: "888px",
			},
			borderRadius: {
				project: "1.5px",
			},
		},
	},
	variants: {
		extend: {},
	},
	plugins: [require("tailwindcss-scrollbar")],
};
