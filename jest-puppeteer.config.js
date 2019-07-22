module.exports = {
	launch: {
		dumpio: true,
		headless: process.env.HEADLESS === 'true',
	},
	browserContext: 'default',
}
