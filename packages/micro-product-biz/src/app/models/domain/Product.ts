/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
import { Moment } from 'moment'
import { Translatable, ModelAutoMapper } from '@micro-fleet/common'

import { momentify } from '../../utils/date-utils'
import { Branch } from './Branch'
import { Category } from './Category'

export class Product extends Translatable {
	public static $createTranslator(): any {
		return new ProductTranslator()
	}

	public id: string = undefined // Must be initialized, otherwise TypeScript compiler will remove it
	public categoryId: string = undefined
	public name: string = undefined
	public price: number = undefined
	public color: string = undefined
	public status: string = undefined
	public createdAt: string = undefined
	public updatedAt?: string = undefined

	public category?: Category = undefined
	public branches?: Branch[] = undefined

	public get createdMoment(): Moment {
		return momentify(this.createdAt)
	}

	public get updatedMoment(): Moment {
		return this.updatedAt ? momentify(this.updatedAt) : null
	}
}

class ProductTranslator extends ModelAutoMapper<Product> {
	constructor() {
		super(Product)
	}

	/**
	 * @override
	 */
	protected $createMap() {
		return super
			.$createMap()
			.forMember('branches', function ({ sourceObject, sourcePropertyName }: any) {
				const { branchIds } = sourceObject
				// If converting from request object
				if (Array.isArray(branchIds)) {
					return branchIds.map((id: string) => ({ id }))
				}
				// If converting from ORM object
				return Branch.from(sourceObject[sourcePropertyName])
			})
			.forMember('category', function ({ sourceObject, sourcePropertyName }: any) {
				return Category.from(sourceObject[sourcePropertyName])
			})
	}
}
