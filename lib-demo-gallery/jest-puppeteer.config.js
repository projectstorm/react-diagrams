module.exports = {
	launch: {
		dumpio: true,
		headless: process.env.CI === 'true'
	},
	browserContext: 'default'
};
