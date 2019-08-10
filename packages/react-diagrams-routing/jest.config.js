const path = require('path');
module.exports = {
	transform: {
		'^.+\\.tsx?$': 'ts-jest'
	},
	roots: [path.join(__dirname, 'tests')],
	testMatch: ['**/*.test.{ts,tsx}']
};
