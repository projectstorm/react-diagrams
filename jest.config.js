// jest.config.js
module.exports = {
	verbose: true,
	moduleFileExtensions: ["ts", "tsx", "js"],
	transform: {
		"^.+\\.(ts|tsx)$": "./tests/preprocessor.js"
	},
	"testMatch": ["**/tests/*\.tsx"]
};