// jest.config.js
module.exports = {
	verbose: true,
	moduleFileExtensions: ["ts", "tsx", "js", "json"],
	transformIgnorePatterns: ["/node_modules/"],
	transform: {
		"^.+\\.(ts|tsx)$": "./tests/helpers/tsx-preprocessor.js",
		"^.+\\.(scss)$": "./tests/helpers/scss-preprocessor.js",
		"^.+\\.css$": "./tests/helpers/scss-preprocessor.js"
	},
	"testMatch": [
		"**/tests/*\.test\.*"
	]
};
