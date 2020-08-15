/// <reference types="debug" />
const debug: debug.IDebugger = require('debug')('nab:svc:category')

import { Maybe, decorators as d } from '@micro-fleet/common'
import { Types as iT, IIdProvider } from '@micro-fleet/id-generator'
import { Types as pT, AtomicSessionFactory } from '@micro-fleet/persistence'

import { Types as T } from '../constants/Types'
import * as dto from '../contracts/dto/category'
import { ICategoryService } from '../contracts/interfaces/ICategoryService'
import { Category } from '../models/domain/Category'
import { ICategoryRepository } from '../repositories/CategoryRepository'
import { ManagementServiceBase } from './ManagementServiceBase'


export class CategoryService extends ManagementServiceBase<Category> implements ICategoryService {

	constructor(
	@d.inject(pT.ATOMIC_SESSION_FACTORY) sessionFactory: AtomicSessionFactory,
		@d.inject(T.CATEGORY_REPO) repo: ICategoryRepository,
		@d.inject(iT.ID_PROVIDER) private _idGen: IIdProvider,
	) {
		super(Category, repo, sessionFactory)
		debug('CategoryService instantiated')
	}

	// #region Create

	/**
	 * @see ICategoryService.create
	 */
	public create(params: dto.CreateCategoryRequest): Promise<dto.CreateCategoryResponse> {
		return this.$create(
			{
				...params,
				id: this._idGen.nextBigInt(),
			},
			dto.CreateCategoryResponse,
		)
	}

	/**
	 * @override
	 */
	protected async $checkCreateViolation(params: dto.CreateCategoryRequest): Promise<Maybe<string>> {
		if (await this.$repo.exists({ name: params.name })) {
			return Maybe.Just('CATEGORY_NAME_ALREADY_EXISTS')
		}
		return Maybe.Nothing()
	}

	// #endregion Create


	/**
	 * @see ICategoryService.edit
	 */
	public edit(params: dto.EditCategoryRequest): Promise<dto.EditCategoryResponse> {
		return this.$edit(params, dto.EditCategoryResponse)
	}

	/**
	 * @see ICategoryService.hardDeleteSingle
	 */
	public hardDeleteSingle(params: dto.DeleteCategoryRequest): Promise<dto.DeleteCategoryResponse> {
		return this.$hardDeleteSingle(params, dto.DeleteCategoryResponse)
	}

	/**
	 * @see ICategoryService.hardDeleteMany
	 */
	public hardDeleteMany(params: dto.DeleteCategoryRequest): Promise<dto.DeleteCategoryResponse> {
		return this.$hardDeleteMany(params, dto.DeleteCategoryResponse)
	}

	/**
	 * @see ICategoryService.getById
	 */
	public getById(params: dto.GetCategoryByIdRequest): Promise<dto.GetSingleCategoryResponse> {
		return this.$getById(params, dto.GetSingleCategoryResponse)
	}

	/**
	 * @see ICategoryService.getList
	 */
	public getList(params: dto.GetCategoryListRequest): Promise<dto.GetCategoryListResponse> {
		debug('CategoryService.getList')
		return this.$getList(params, dto.GetCategoryListResponse)
	}

}
