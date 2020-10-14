const path = require('path');
const webpack = require('webpack');

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
	plugins: [
		    new webpack.BannerPlugin({ banner: "#!/usr/bin/env node", raw: true }),
	]
};
