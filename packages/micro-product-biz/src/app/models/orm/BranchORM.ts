import { decorators as d } from '@micro-fleet/common'
import { ORMModelBase } from '@micro-fleet/persistence'

import { momentify, toUtcTimeString } from '../../utils/date-utils'

@d.translatable()
export class BranchORM extends ORMModelBase {
	public id: string = undefined // Must be initialized, otherwise TypeScript compiler will remove it
	public name: string = undefined
	public createdAt: string = undefined
	public updatedAt?: string = undefined

	/**
	 * @override
	 */
	public static get tableName(): string {
		return 'public.nab_branches'
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
	 */
	public $beforeUpdate(opt: any, queryContext: any) {
		void super.$beforeUpdate(opt, queryContext)
		this.updatedAt = momentify().format()
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
			updatedAt: toUtcTimeString(json.updatedAt),
		}
	}
}
