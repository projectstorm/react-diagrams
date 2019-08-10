const path = require('path');
module.exports = {
	preset: 'jest-puppeteer',
	transform: {
		'^.+\\.tsx?$': 'ts-jest'
	},
	roots: [path.join(__dirname, 'tests-e2e')],
	testMatch: ['**/*.test.{ts,tsx}']
};
