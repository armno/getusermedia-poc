module.exports = {
	mode: "jit",
	purge: {
		content: ["./index.html"],
		safelist: ["bg-red-500", "animate-pulse"],
	},
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {
			colors: {
				brand: {
					light: "#fe7c7c",
					DEFAULT: "#f84e4e",
					dark: "#c83636",
				},
			},
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
};
