import { decorators as d } from '@micro-fleet/common'
import { ORMModelBase } from '@micro-fleet/persistence'

import { momentify, toUtcTimeString } from '../../utils/date-utils'


@d.translatable()
export class RequestLogEntryORM extends ORMModelBase {
	public id: string = undefined
	public operationName: string = undefined
	public ipAddress: string = undefined
	public deviceName: string = undefined
	public requestPayload: object = undefined
	public createdAt: string = undefined

	/**
	 * @override
	 */
	public static get tableName(): string {
		return 'public.nab_request_logs'
	}

	/**
	 * [ObjectionJS]
	 */
	public $beforeInsert(queryContext: any) {
		void super.$beforeInsert(queryContext)
		this.createdAt = momentify().format()
	}

	/**
	 * [ObjectionJS]
	 * This method converts the JSON object from the database format
	 * to the entity class.
	 */
	public $parseDatabaseJson(json: any) {
		const entityProps = super.$parseDatabaseJson(json)
		return {
			...entityProps,
			createdAt: toUtcTimeString(json.createdAt),
		}
	}
}
