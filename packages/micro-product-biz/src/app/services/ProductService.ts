/// <reference types="debug" />
const debug: debug.IDebugger = require('debug')('nab:svc:product')

import { Maybe, decorators as d, PagedData } from '@micro-fleet/common'
import { Types as iT, IIdProvider } from '@micro-fleet/id-generator'
import { Types as pT, AtomicSessionFactory } from '@micro-fleet/persistence'

import { Types as T } from '../constants/Types'
import * as dto from '../contracts/dto/product'
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
	) {
		super(Product, repo, sessionFactory)
		debug('ProductService instantiated')
	}

	// #region Create

	/**
	 * @see IProductRepository.create
	 */
	public create(params: dto.CreateProductRequest): Promise<dto.CreateProductResponse> {
		return this.$create(
			{
				...params,
				id: this._idGen.nextBigInt().toString(),
			},
			dto.CreateProductResponse,
		)
	}

	/**
	 * @override
	 */
	protected $checkCreateViolation(params: dto.CreateProductRequest): Promise<Maybe<string>> {
		if (params.name.toLocaleLowerCase().split(' ').includes('shit')) {
			return Promise.resolve(Maybe.Just('PRODUCT_NAME_WITH_BANNED_WORDS'))
		}
		return Promise.resolve(Maybe.Nothing())
	}

	// #endregion Create


	/**
	 * @see IProductRepository.edit
	 */
	public edit(params: dto.EditProductRequest): Promise<dto.EditProductResponse> {
		return this.$edit(params, dto.EditProductResponse)
	}

	/**
	 * @see IProductRepository.hardDeleteSingle
	 */
	public hardDeleteSingle(params: dto.DeleteProductRequest): Promise<dto.DeleteProductResponse> {
		return this.$hardDeleteSingle(params, dto.DeleteProductResponse)
	}

	/**
	 * @see IProductRepository.hardDeleteMany
	 */
	public hardDeleteMany(params: dto.DeleteProductRequest): Promise<dto.DeleteProductResponse> {
		return this.$hardDeleteMany(params, dto.DeleteProductResponse)
	}

	/**
	 * @see IProductRepository.getById
	 */
	public getById(params: dto.GetProductByIdRequest): Promise<dto.GetSingleProductResponse> {
		return this.$getById(params, dto.GetSingleProductResponse)
	}

	/**
	 * @see IProductRepository.getList
	 */
	public getList(params: dto.GetProductListRequest): Promise<dto.GetProductListResponse> {
		return this.$getList(params, dto.GetProductListResponse)
	}

	/**
	 * @see IProductRepository.getRecalledList
	 */
	public async getRecalledList(params: dto.GetProductListRequest): Promise<dto.GetProductListResponse> {
		const fetchedDomainModels: PagedData<Product> = await this._productRepo.pageRecalled(params as any)

		if (fetchedDomainModels.length) {
			const result = dto.GetProductListResponse.from(fetchedDomainModels)
			return result
		}
		return new dto.GetProductListResponse()
	}

}
