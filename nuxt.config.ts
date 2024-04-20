// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	app: {
		head: {
			htmlAttrs: {
				'data-bs-theme': 'dark',
			},
		},
	},
	devtools: { enabled: true },
	css: ['~/assets/scss/main.scss'],
});
