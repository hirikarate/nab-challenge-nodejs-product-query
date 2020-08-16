import {
	decorators as d,
	PagedData,
	Maybe,
	ITranslatable,
	SingleId,
} from '@micro-fleet/common'
import * as p from '@micro-fleet/persistence'

import {
	ResultResponseConstructor,
	MaybeResponseConstructor,
	IListResponseConstructor,
	IAtomicRequest, IMultiIds,
} from '../contracts/dto/dto-base'
import { momentify } from '../utils/date-utils'


/**
 * Provides methods for common CRUD operations
 */
@d.injectable()
export class ManagementServiceBase<TDomain extends object> {

	constructor(
		@d.unmanaged() protected readonly $DomainClass: ITranslatable,
		@d.unmanaged() protected readonly $repo: p.IRepository<TDomain>,
		@d.unmanaged() protected readonly $sessionFactory: p.AtomicSessionFactory,
	) {}


	// #region Create

	protected async $create<T extends InstanceType<ResultResponseConstructor>>(
		params: any,
		ResponseClass: ResultResponseConstructor,
		options?: p.RepositoryCreateOptions,
	): Promise<T> {
		const violation = await this.$checkCreateViolation(params)
		if (violation.isJust) {
			return new ResponseClass(false, violation.value) as T
		}
		const newDomainModel = this.$DomainClass.from(params)
		const createdDomainModel = await this.$repo.create(newDomainModel, options)
		const result = ResponseClass.from(createdDomainModel)
		return result
	}

	/**
	 * Can be overriden by derived class to check business rule for creating.
	 */
	protected $checkCreateViolation(params: any): Promise<Maybe> {
		return Promise.resolve(Maybe.Nothing())
	}

	// #endregion Create


	// #region Delete

	protected async $hardDeleteSingle<T extends InstanceType<ResultResponseConstructor>>(
		params: IMultiIds,
		ResponseClass: ResultResponseConstructor,
		options?: p.RepositoryDeleteOptions,
	): Promise<T> {
		const violation = await this.$checkDeleteSingleViolation(params)
		if (violation.isJust) {
			return new ResponseClass(false, violation.value) as T
		}

		const id = new SingleId(params.ids[0])
		const affectedCount: number = await this.$repo.deleteSingle(id, options)
		if (affectedCount) {
			const result = ResponseClass.from({
				deletedAt: momentify().format(),
			})
			return result
		}
		return new ResponseClass(false) as T
	}

	/**
	 * Can be overriden by derived class to check business rule for deleting.
	 */
	protected $checkDeleteSingleViolation(params: any): Promise<Maybe> {
		return Promise.resolve(Maybe.Nothing())
	}


	protected async $hardDeleteMany<T extends InstanceType<ResultResponseConstructor>>(
		params: IAtomicRequest & IMultiIds,
		ResponseClass: ResultResponseConstructor,
		options?: p.RepositoryDeleteOptions,
	): Promise<T> {
		const violation = await this.$checkDeleteManyViolation(params)
		if (violation.isJust) {
			return new ResponseClass(false, violation.value) as T
		}

		const ids = params.ids.map(id => new SingleId(id))
		let task: Promise<number>
		if (options && options.atomicSession) {
			task = this.$repo.deleteMany(ids, options)
		}
		else if (params.isAtomic) {
			task = this.$sessionFactory.startSession()
				.pipe((atomicSession: p.AtomicSession) => {
					return this.$repo.deleteMany(ids, { ...options, atomicSession })
				})
				.closePipe()
		}
		else {
			task = this.$repo.deleteMany(ids, options)
		}
		const affectedCount: number = await task
		if (affectedCount) {
			const result = ResponseClass.from({
				deletedAt: momentify().format(),
			})
			return result
		}
		return new ResponseClass(false) as T
	}

	/**
	 * Can be overriden by derived class to check business rule for deleting.
	 */
	protected $checkDeleteManyViolation(params: any): Promise<Maybe> {
		return Promise.resolve(Maybe.Nothing())
	}

	// #endregion Delete


	// #region Edit

	protected async $edit<TC extends InstanceType<ResultResponseConstructor>>(
		params: any,
		ResponseClass: ResultResponseConstructor,
		options?: p.RepositoryPatchOptions,
	): Promise<TC> {
		const violation = await this.$checkEditViolation(params)
		if (violation.isJust) {
			return new ResponseClass(false, violation.value) as TC
		}

		const partialDomainModel = this.$DomainClass.from(params)
		const maybe = await this.$repo.patch(partialDomainModel, options)
		if (maybe.isJust) {
			const result = ResponseClass.from(maybe.value)
			return result
		}
		return new ResponseClass(false) as TC
	}

	/**
	 * Can be overriden by derived class to check business rule for editing.
	 */
	protected $checkEditViolation(params: any): Promise<Maybe> {
		return Promise.resolve(Maybe.Nothing())
	}

	// #endregion Edit


	// #region Get

	protected async $getById<TC extends InstanceType<MaybeResponseConstructor>>(
		params: any,
		ResponseClass: MaybeResponseConstructor,
		options?: p.RepositoryFindOptions,
	): Promise<TC> {
		const id = new SingleId(params.id)
		params.relations = this.$objectifyRelations(params.relations)
		const maybe = await this.$repo.findById(id, { ...params, ...options })
		if (maybe.isJust) {
			const result = ResponseClass.from(maybe.value)
			return result
		}
		return new ResponseClass(false) as TC
	}

	protected async $getList<TC extends InstanceType<IListResponseConstructor>>(
		params: any,
		ResponseClass: IListResponseConstructor,
		options?: p.RepositoryPageOptions,
	): Promise<TC> {
		params.relations = this.$objectifyRelations(params.relations)
		const fetchedDomainModels: PagedData<TDomain> = await this.$repo.page({ ...params, ...options })

		if (fetchedDomainModels.length) {
			const result = ResponseClass.from(fetchedDomainModels)
			return result
		}
		return new ResponseClass() as TC
	}

	// #endregion Get

	/**
	 * Converts string array to Objection's relation expression
	 * @example
	 *
	 * Input: ['tenant', 'category']
	 * Output: {
	 *   tenant: true,
	 *   category: true,
	 * }
	 *
	 * Input: ['tenant', 'product.producer']
	 * Output: {
	 *   tenant: true,
	 *   product: {
	 *      producer: true,
	 *   },
	 * }
	 */
	protected $objectifyRelations(relations: string[]): object {
		if (!relations) { return null }
		return relations.reduce((relationObj, currentRelation) => {
			const nestedRelations = currentRelation.split('.')
			let relation = {}
			nestedRelations.reduce((prev, cur, index) => {
				if (index === 0) {
					relation = prev
				}
				prev[cur] = (index === nestedRelations.length - 1) ? true : {}
				return prev[cur]
			}, {})
			return {
				...relationObj,
				...relation,
			}
		}, {})
	}
}
