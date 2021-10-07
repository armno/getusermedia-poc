module.exports = {
	mode: 'jit',
	purge: ["./index.html"],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {
			colors: {
				brand: {
					light: '#fe7c7c',
					DEFAULT: '#f84e4e',
					dark: '#c83636'
				}
			},
			fontFamily: {
				karla: 'Karla, sans-serif',
				dm: ['DM Mono', 'monospace']
			}
		},
	},
	variants: {
		extend: {
		},
	},
	plugins: [],
};
