import { Model } from 'objection'
import { decorators as d } from '@micro-fleet/common'
import { ORMModelBase } from '@micro-fleet/persistence'

import { momentify, toUtcTimeString } from '../../utils/date-utils'
import { BranchORM } from './BranchORM'
import { CategoryORM } from './CategoryORM'


@d.translatable()
export class ProductORM extends ORMModelBase {
	public id: string = undefined // Must be initialized, otherwise TypeScript compiler will remove it
	public categoryId: string = undefined
	public name: string = undefined
	public price: number = undefined
	public color: string = undefined
	public status: string = undefined
	public createdAt: string = undefined
	public updatedAt?: string = undefined

	public category: CategoryORM = undefined
	public branches?: BranchORM[] = undefined

	/**
	 * @override
	 */
	public static get tableName(): string {
		return 'public.nab_products'
	}

	public static relationMappings = {
		branches: {
			relation: Model.ManyToManyRelation,
			modelClass: BranchORM,
			join: {
				from: `${ProductORM.tableName}.id`,
				through: {
					from: 'nab_product_branch.productId',
					to: 'nab_product_branch.branchId',
				},
				to: `${BranchORM.tableName}.id`,
			},
		},
		category: {
			relation: Model.BelongsToOneRelation,
			modelClass: CategoryORM,
			join: {
				from: `${ProductORM.tableName}.categoryId`,
				to: `${CategoryORM.tableName}.id`,
			},
		},
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
