import * as joi from '@hapi/joi'

import { Translatable, decorators as d } from '@micro-fleet/common'

import { ResultResponse } from './dto-base'


// #region RPC Constants

export const MODULE_NAME = 'nabStatistics'

export enum Action {
	CREATE = 'create',
}

// #endregion RPC Constants

// #region Create

export class CreateStatisticsRequest extends Translatable {
	@d.required()
	@d.string({ minLength: 3, maxLength: 100 })
	public readonly operationName: string = undefined

	@d.required()
	@d.string({ maxLength: 100 })
	public readonly ipAddress: string = undefined

	@d.required()
	@d.string({ maxLength: 200 })
	public readonly deviceName: string = undefined

	@d.validateProp(joi.object())
	public readonly requestPayload: object = undefined
}

export class CreateStatisticsResponse extends ResultResponse {
	public id: string = undefined
	public createdAt: string = undefined
}

// #endregion Create
