/// <reference types="debug" />
const debug: debug.IDebugger = require('debug')('nab:addon:awses')

import * as AWS from 'aws-sdk'
import { Client, RequestParams, ApiResponse } from '@elastic/elasticsearch'
import createAwsConnector = require('aws-elasticsearch-connector')
import {
	decorators as d,
	Guard,
	IConfigurationProvider,
	IDependencyContainer,
	IServiceAddOn,
	Types as ComT,
} from '@micro-fleet/common'

import { AWS as AwsKeys, ElasticSearch as ES } from '../constants/SettingKeys'
import { Types as T } from '../constants/Types'


/**
 * Initializes AWS ElasticSearch instance.
 */
@d.injectable()
export class AwsEsAddOn implements IServiceAddOn {

	public readonly name: string = 'AwsAddOn'

	private _client: Client

	constructor(
		@d.inject(ComT.CONFIG_PROVIDER) private _config: IConfigurationProvider,
		@d.inject(ComT.DEPENDENCY_CONTAINER) private _diContainer: IDependencyContainer,
	) {
		Guard.assertArgDefined('Configuration provider', _config)
		Guard.assertArgDefined('Dependency container', _diContainer)
	}

	/**
	 * @see IServiceAddOn.init
	 */
	public init(): Promise<void> {
		this._initClient()
		this._diContainer.bindConstant(T.ELASTIC_SEARCH_CLIENT, this._client)
		return this._initIndices()
	}

	/**
	 * @see IServiceAddOn.deadLetter
	 */
	public deadLetter(): Promise<void> {
		return Promise.resolve()
	}

	/**
	 * @see IServiceAddOn.dispose
	 */
	public async dispose(): Promise<void> {
		return Promise.resolve()
	}


	private _initClient(): void {
		const domainMaybe = this._config.get(ES.HOST)
		const accessMaybe = this._config.get(AwsKeys.ACCESS_KEY)
		const secretMaybe = this._config.get(AwsKeys.SECRET_KEY)
		const regionMaybe = this._config.get(AwsKeys.REGION)
		if (regionMaybe.isJust && accessMaybe.isJust && secretMaybe.isJust) {
			AWS.config.update({
				credentials: new AWS.Credentials(accessMaybe.value, secretMaybe.value),
				region: regionMaybe.value,
			})
		}

		this._client = new Client({
			...createAwsConnector(AWS.config),
			node: domainMaybe.value,
		})
	}

	/**
	 * Creates index mappings if they don't exist.
	 */
	private async _initIndices(): Promise<void> {
		const mappings = this._config.get(ES.MAPPINGS).tryGetValue([])
		await Promise.all(mappings.map(async (m: RequestParams.IndicesPutMapping) => {
			debug(`Checking index "${m.index}"...`)
			if (await this._createIndexIfNotExist(m.index)) {
				return
			}
			debug(`Creating mapping "${m.index}"...`)
			await this._createMapping(m)
		}))
	}

	/**
	 * @returns `true` if index already exists, `false` if it doesn't and needs creating
	 */
	private async _createIndexIfNotExist(index: string | string[]): Promise<boolean> {
		const params: any = {
			index,
		}
		const { body: isExisting }: ApiResponse = await this._client.indices.exists(params)
		if (isExisting) {
			return true
		}
		await this._client.indices.create(params)
		return false
	}

	private _createMapping(mapping: RequestParams.IndicesPutMapping): Promise<any> {
		return this._client.indices.putMapping(mapping)
	}
}
