const nodeExternals = require('webpack-node-externals');

module.exports = {
	mode : "development",
	entry: './index.js',
	output: { filename: './server.js'},
  target: 'node',
  externals: [nodeExternals()]
}
