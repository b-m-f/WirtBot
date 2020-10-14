const path = require('path');

module.exports = {
	entry: './index.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'installer.js',
		chunkFormat: 'commonjs'
	},
	target: 'async-node',
	optimization: {
		minimize: false,
	},
	experiments: { syncWebAssembly: true },
};
