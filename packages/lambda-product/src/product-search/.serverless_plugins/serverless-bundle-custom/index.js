const path = require('path');

const ServerlessBundlePlugin = require('serverless-bundle');


class ServerlessBundleCustomPlugin extends ServerlessBundlePlugin {
	constructor(serverless, options) {
		super(serverless, options);

		const previousHandler = this.hooks["before:webpack:validate:validate"];

		this.hooks["before:webpack:validate:validate"] = () => {
			previousHandler();
			const { webpack } = this.serverless.service.custom;
			const servicePath = this.serverless.config.servicePath;

			const configPath = path.resolve(__dirname, '../../../../webpack.config.js');
			// `webpackConfig` requires relative path.
			webpack.webpackConfig = path.relative(servicePath, configPath);
		};
	}
}

module.exports = ServerlessBundleCustomPlugin;
