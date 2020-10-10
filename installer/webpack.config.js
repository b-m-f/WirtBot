const path = require('path');

module.exports = {
	entry: './index.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'installer.js'
	},
	target: 'node',
	experiments: { syncWebAssembly: true },
};
