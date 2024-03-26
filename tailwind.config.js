/** @type {import('tailwindcss').Config} */
const { plugin } = require("twrnc");
const { getRandomColor } = require('./lib/utils');
module.exports = {
	content: [],
	theme: {
		extend: {
			colors: {
				randomColor: getRandomColor(),
				background: "hsl(132, 50%, 94%)", // #638475 => hsl(132, 50%, 94%)
				foreground: "hsl(49, 37%, 94%)",
				card: "hsl(135, 71%, 97.6%)", // #90E39A => hsl(135, 71%, 97.6%)
				"card-foreground": "hsl(201, 0%, 100%)",
				popover: "hsl(135, 84%, 98%)", // #DDF093 => hsl(135, 84%, 98%)
				"popover-foreground": "hsl(0, 0%, 26.7%)", // or any other suitable dark value for
				primary: "hsl(127, 60%, 73%)", // same as before
				"primary-foreground": "hsl(201, 0%, 100%)",
				secondary: "hsl(225, 84.9%, 52.9%)", // new secondary color for light mode
				"secondary-foreground": "hsl(0, 0%, 26.7%)", // or any other suitable dark value for
				"text-secondary": "hsl(0, 0%, 89.8%)",
				input: "hsl(0, 0%, 89.8%)",
				ring: "hsl(0, 0%, 3.9%)",
				"text-foreground": "hsl(0, 0%, 25%)",
				muted: "hsl(0, 0%, 89.8%)",
	            "muted-foreground": "hsl(0, 0%, 10.2%)",
				accent: "hsl(0, 0%, 96.1%)",
                "accent-foreground": "hsl(0, 0%, 9%)",
                destructive: "hsl(0, 84.2%, 60.2%)",
                "destructive-foreground": "hsl(0, 0%, 98%)",
				// Dark
				"dark-background": "hsl(210, 0%, 85%)",
				"dark-foreground": "hsl(0, 0%, 20%)",
				"dark-card": "hsl(0, 0%, 3.9%)",
				"dark-card-foreground": "hsl(201, 0%, 85%)",
				"dark-popover": "hsl(210, 4.6%, 87.4%)", // or any other suitable light value for
				"dark-popover-foreground": "hsl(0, 0%, 15%)",
				"dark-primary": "hsl(217, 48.6%, 73.6%)",
				"dark-primary-foreground": "hsl(201, 0%, 98%)", // or any other suitable light value
				"dark-secondary": "hsl(215, 88.3%, 49.7%)",
				"dark-secondary-foreground": "hsl(0, 0%, 63.9%)", // or any other suitable light
				"dark-muted": "hsl(216, 11.3%, 48.4%)",
				"dark-muted-foreground": "hsl(0, 0%, 77.3%)", // or any other suitable light value
				"dark-accent": "hsl(225, 87.1%, 51.4%)",
				"dark-accent-foreground": "hsl(0, 0%, 98%)",
				"dark-destructive": "hsl(0, 84.2%, 60.2%)",
				"dark-destructive-foreground": "hsl(0, 84.2%, 60.2%)",
				"dark-border": "hsl(0, 0%, 14.9%)",
				"dark-input": "hsl(0, 0%, 29.8%)",
				"dark-ring": "hsl(0, 0%, 56.3%)",
			},
		},
	},
	plugins: [
		plugin(({ addUtilities }) => {
			addUtilities({
				// Typography
				h1: `text-4xl text-dark-foreground dark:text-foreground font-extrabold tracking-tight lg:text-5xl`,
				h2: `text-3xl text-dark-foreground dark:text-foreground font-semibold tracking-tight`,
				h3: `text-2xl text-dark-foreground dark:text-foreground font-semibold tracking-tight`,
				h4: `text-xl text-foreground dark:text-dark-foreground font-semibold tracking-tight`,
				p: `leading-7 text-foreground dark:text-foreground`,
				lead: `text-xl text-muted-foreground dark:text-dark-muted-foreground`,
				large: `text-lg text-foreground dark:text-dark-foreground font-semibold`,
				small: `text-sm text-foreground dark:text-dark-foreground font-medium leading-[0px]`,
				muted: `text-sm text-muted-foreground dark:text-dark-muted-foreground`,
				bell: `ml-6 text-3xl text-primary dark:text-dark-primary font-semibold`,
				plus:`text-primary dark:text-dark-primary text-3xl`,
				"border-list": `border-b border-stone-400 dark:border-neutral-500 flex-row mr-2 p-4 justify-between`,
				"border-login": `border rounded-lg border-stone-400 dark:border-neutral-500 flex-row mr-2 p-4 justify-between`,
				"border-input":`min-w-60 p-2 rounded border border-primary dark:border-dark-primary text-dark-foreground dark:text-foreground h-12`,
			});
		}),
	],
};
