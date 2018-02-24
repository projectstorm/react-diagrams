var glob = require("glob");
const tsc = require('typescript');
const tsConfig = require('../../tsconfig.json');
const path = require("path");

let root = path.normalize(__dirname+"/../../");

module.exports = {
	process(src, p) {

		src += `
			storiesOf("Tests", module)
		`;
		let files = glob.sync(__dirname + '/../../demos/demo-*/index.tsx');


		src += files.map((file) => {
			return `
				.add("`+  path.relative(root,file)+`",() => {
					return require("` + file + `").default();
				})
			`
		}).join('\n');

		return tsc.transpile(src, tsConfig.compilerOptions, p, []);
	},
};