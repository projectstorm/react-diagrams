module.exports = {
	launch: {
		args: ['--no-sandbox'],
		executablePath: process.env.PUPPETEER_EXEC_PATH || undefined, // set by docker container
		headless: false
	},
	browserContext: 'default'
};
