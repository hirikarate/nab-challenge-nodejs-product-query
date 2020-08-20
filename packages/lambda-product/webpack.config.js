const path = require('path');

const slsw = require('serverless-webpack');
const webpackConfig = require('serverless-bundle/src/webpack.config.js');
const TerserPlugin = require('terser-webpack-plugin');


const isLocal = slsw.lib.options.stage === 'dev';

const babelLoader = webpackConfig.module.rules[0].use.find(u => u.loader === 'babel-loader');
if (babelLoader) {
	// The features of ES2020 which are not natively supported by Node v12
	babelLoader.options.plugins = [
		'@babel/plugin-proposal-nullish-coalescing-operator',
		'@babel/plugin-proposal-optional-chaining',
		["@babel/plugin-proposal-private-property-in-object", {"loose": true }],
		["@babel/plugin-proposal-class-properties", {"loose": true }],
		["@babel/plugin-proposal-private-methods", {"loose": true }],
	];
}

webpackConfig.optimization = {
	minimize: !isLocal,
	minimizer: [
		new TerserPlugin({
			parallel: true,
			cache: false,
			terserOptions: {
				warnings: false,
				ie8: false,
				output: {
					comments: false,
				},
			},
			extractComments: false,
		})
	],
	removeAvailableModules: true,
};

webpackConfig.resolve.alias = {
	'~src': path.resolve(__dirname, 'src'),
	'~shared': path.resolve(__dirname, 'src/_shared'),
	'~shared-test': path.resolve(__dirname, 'test/_shared'),
	'joi': path.resolve(__dirname, 'node_modules/joi/dist/joi-browser.min.js'),
};

module.exports = webpackConfig;
