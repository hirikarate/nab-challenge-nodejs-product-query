/// <reference types="debug" />
const debug: debug.IDebugger = require('debug')('nab:svc:product')

import {
	decorators as d,
	Maybe,
	PagedData,
	BusinessInvariantError,
	ValidationErrorItem,
} from '@micro-fleet/common'
import { Types as iT, IIdProvider } from '@micro-fleet/id-generator'
import { Types as pT, AtomicSessionFactory } from '@micro-fleet/persistence'

import { Types as T } from '../constants/Types'
import * as bdto from '../contracts/dto/branch'
import * as cdto from '../contracts/dto/category'
import * as pdto from '../contracts/dto/product'
import { IBranchService } from '../contracts/interfaces/IBranchService'
import { ICategoryService } from '../contracts/interfaces/ICategoryService'
import { IProductService } from '../contracts/interfaces/IProductService'
import { Product } from '../models/domain/Product'
import { IProductRepository } from '../repositories/ProductRepository'
import { ManagementServiceBase } from './ManagementServiceBase'


export class ProductService extends ManagementServiceBase<Product> implements IProductService {
	private get _productRepo(): IProductRepository {
		return this.$repo as IProductRepository
	}

	constructor(
	@d.inject(pT.ATOMIC_SESSION_FACTORY) sessionFactory: AtomicSessionFactory,
		@d.inject(T.PRODUCT_REPO) repo: IProductRepository,
		@d.inject(iT.ID_PROVIDER) private _idGen: IIdProvider,
		@d.inject(T.BRANCH_SVC) private _branchSvc: IBranchService,
		@d.inject(T.CATEGORY_SVC) private _categorySvc: ICategoryService,
	) {
		super(Product, repo, sessionFactory)
		debug('ProductService instantiated')
	}

	// #region Create

	/**
	 * @see IProductRepository.create
	 */
	public create(params: pdto.CreateProductRequest): Promise<pdto.CreateProductResponse> {
		return this.$create(
			{
				...params,
				id: this._idGen.nextBigInt().toString(),
			},
			pdto.CreateProductResponse,
		)
	}

	/**
	 * @override
	 */
	protected async $checkCreateViolation(params: pdto.CreateProductRequest): Promise<Maybe> {
		const maybeViolations = await Promise.all([
			this._checkNameViolation(params.name),
			this._checkBranchViolation(params.branchIds),
			this._checkCategoryViolation(params.categoryId),
		])
		const violations = maybeViolations.filter(mb => mb.isJust).map(mb => mb.value)
		return violations.length
			? Promise.resolve(Maybe.Just(new BusinessInvariantError(violations)))
			: Promise.resolve(Maybe.Nothing())
	}

	// #endregion Create


	// #region Edit

	/**
	 * @see IProductRepository.edit
	 */
	public edit(params: pdto.EditProductRequest): Promise<pdto.EditProductResponse> {
		return this.$edit(params, pdto.EditProductResponse)
	}

	/**
	 * @override
	 */
	protected $checkEditViolation(params: any): Promise<Maybe> {
		return this.$checkCreateViolation(params)
	}

	// #endregion Edit


	/**
	 * @see IProductRepository.hardDeleteSingle
	 */
	public hardDeleteSingle(params: pdto.DeleteProductRequest): Promise<pdto.DeleteProductResponse> {
		return this.$hardDeleteSingle(params, pdto.DeleteProductResponse)
	}

	/**
	 * @see IProductRepository.hardDeleteMany
	 */
	public hardDeleteMany(params: pdto.DeleteProductRequest): Promise<pdto.DeleteProductResponse> {
		return this.$hardDeleteMany(params, pdto.DeleteProductResponse)
	}

	/**
	 * @see IProductRepository.getById
	 */
	public getById(params: pdto.GetProductByIdRequest): Promise<pdto.GetSingleProductResponse> {
		return this.$getById(params, pdto.GetSingleProductResponse)
	}

	/**
	 * @see IProductRepository.getList
	 */
	public getList(params: pdto.GetProductListRequest): Promise<pdto.GetProductListResponse> {
		return this.$getList(params, pdto.GetProductListResponse)
	}

	/**
	 * @see IProductRepository.getRecalledList
	 */
	public async getRecalledList(params: pdto.GetProductListRequest): Promise<pdto.GetProductListResponse> {
		const fetchedDomainModels: PagedData<Product> = await this._productRepo.pageRecalled(params as any)

		if (fetchedDomainModels.length) {
			const result = pdto.GetProductListResponse.from(fetchedDomainModels)
			return result
		}
		return new pdto.GetProductListResponse()
	}

	private async _checkNameViolation(productName: string): Promise<Maybe> {
		if (productName.toLocaleLowerCase().split(' ').includes('shit')) {
			return Promise.resolve(Maybe.Just(<ValidationErrorItem>{
				message: 'PRODUCT_NAME_WITH_BANNED_WORDS',
				path: ['name'],
				value: productName,
			}))
		}
		return Promise.resolve(Maybe.Nothing())
	}

	private async _checkCategoryViolation(categoryId: string): Promise<Maybe> {
		const request = cdto.CheckCategoryExistingRequest.from({
			id: categoryId,
		})
		const response = await this._categorySvc.exists(request)
		return response.isExisting
			? Maybe.Nothing()
			: Maybe.Just(<ValidationErrorItem>{
				message: 'CATEGORY_NOT_EXISTING',
				path: ['categoryId'],
				value: categoryId,
			})
	}

	private async _checkBranchViolation(branchIds: string[]): Promise<Maybe> {
		const existPromises = branchIds.map(id => this._branchSvc.exists(
			bdto.CheckBranchExistingRequest.from({ id }),
		))
		const existMaybes = await Promise.all(existPromises)
		const nonexistIds = existMaybes
			.reduce((prev, mb, i) => {
				if (mb.isExisting) return prev
				prev.push(branchIds[i])
				return prev
			}, [])

		return nonexistIds.length
			? Maybe.Just(<ValidationErrorItem>{
				message: 'BRANCHES_NOT_EXISTING',
				path: ['branchIds'],
				value: nonexistIds,
			})
			: Maybe.Nothing()
	}
}
