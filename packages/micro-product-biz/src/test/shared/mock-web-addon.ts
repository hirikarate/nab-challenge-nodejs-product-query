import {
	Types as CmT,
	IConfigurationProvider,
	DependencyContainer,
	IDependencyContainer,
} from '@micro-fleet/common'
import {
	Types as WebT,
	ExpressServerAddOn,
	ControllerCreationStrategy,
} from '@micro-fleet/web'

import { createMockConfigProvider } from './mock-config'


/**
 * Creates a mock instance of ExpressServerAddOn
 */
export function createExpressMockServer(options: CreateExpressMockServerOptions = {}): CreateExpressMockServerResult {
	const opts = {
		configs: {},
		createDependencyContainer: () => new DependencyContainer(),
		createConfigurationProvider: (configs: object) => createMockConfigProvider(configs),
		...options,
	}
	const container: IDependencyContainer = opts.createDependencyContainer()
	// The user of this function must call this:
	// serviceContext.setDependencyContainer(container)
	const configProvider: IConfigurationProvider = opts.createConfigurationProvider(opts.configs, container)

	const server = new ExpressServerAddOn(configProvider, container)
	// server.cleanUpDecorators = false
	server.controllerCreation = ControllerCreationStrategy.SINGLETON

	container.bindConstant(CmT.DEPENDENCY_CONTAINER, container)
	container.bindConstant(CmT.CONFIG_PROVIDER, configProvider)
	container.bindConstant(WebT.WEBSERVER_ADDON, server)
	return {
		server,
		configProvider,
		depContainer: container,
	}
}

export type CreateExpressMockServerOptions = {
	/**
	 * Data for configuration provider.
	 */
	configs?: object,

	/**
		* Factory function to create dependency container.
		*/
	createDependencyContainer?: () => IDependencyContainer,

	/**
		* Factory function to create configuration container.
		* @param configs This is `configs` option.
		* @param depContainer This is the container created by the option `createDependencyContainer()`.
		*/
	createConfigurationProvider?: (configs: object, depContainer: IDependencyContainer) => IConfigurationProvider,
}

export type CreateExpressMockServerResult = {
	server: ExpressServerAddOn,
	configProvider: IConfigurationProvider,
	depContainer: IDependencyContainer,
}
