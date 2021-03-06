import { IConfigurationProvider, Maybe } from '@micro-fleet/common'


/**
 * Creates a mock implementation of IConfigurationProvider, using the specified config data.
 * @param configs The data to use.
 */
export function createMockConfigProvider(configs: object): IConfigurationProvider {
	return new MockConfigurationProvider(configs)
}

class MockConfigurationProvider implements IConfigurationProvider {
	public readonly name: string = 'MockConfigurationProvider'
	public configFilePath: string

	public enableRemote: boolean = false
	public enableCors: boolean = false

	constructor(private _config: object) {
		// Empty
	}

	public get(key: string): Maybe<any> {
		// eslint-disable-next-line no-prototype-builtins
		return this._config.hasOwnProperty(key) ? Maybe.Just(this._config[key]) : Maybe.Nothing()
	}

	public init = () => Promise.resolve()
	public deadLetter = () => Promise.resolve()
	public dispose = () => Promise.resolve()
	public onUpdate = (_listener: (changedKeys: string[]) => void) => { /* Empty */ }
	public fetch = () => Promise.resolve(true)
}
