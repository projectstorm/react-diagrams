var glob = require("glob");
const tsc = require('typescript');
const tsConfig = require('../../tsconfig.json');

module.exports = {
	process(src, path) {

		src += `
			storiesOf("Tests", module)
		`;
		let files = glob.sync(__dirname + '/../../demos/demo-*/index.tsx');


		src += files.map((file) => {
			return `
				.add("`+file+`",require("` + file + `").default)
			`
		}).join('\n');

		return tsc.transpile(src, tsConfig.compilerOptions, path, []);
	},
};