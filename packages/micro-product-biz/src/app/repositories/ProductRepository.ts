/// <reference types="debug" />
const debug: debug.IDebugger = require('debug')('nab:repo:product')

import { QueryBuilder } from 'objection'
import { decorators as cd, PagedData, Maybe } from '@micro-fleet/common'
import * as p from '@micro-fleet/persistence'

import { ProductStatus } from '../contracts/constants-shared'
import { Product } from '../models/domain/Product'
import { ProductORM } from '../models/orm/ProductORM'


/*
 * Provides methods to manage products.
 */
export interface IProductRepository extends p.IRepository<Product> {
	/**
	 * Gets paged list of recalled products
	 */
	pageRecalled: (opts: p.RepositoryPageOptions) => Promise<PagedData<Product>>
}

export class ProductRepository extends p.PgCrudRepositoryBase<ProductORM, Product> implements IProductRepository {
	constructor(
	/* eslint-disable-next-line @typescript-eslint/indent */
		@cd.inject(p.Types.DB_CONNECTOR) connector: p.IDatabaseConnector,
	) {
		super(ProductORM, Product, connector)
		debug('ProductRepository instantiated')
	}

	/**
	 * @override
	 */
	protected $buildCreateQuery(query: QueryBuilder<ProductORM>, model: Product, ormModel: ProductORM,
		opts: p.RepositoryCreateOptions): p.QueryCallbackReturn {

		const q = query.insertGraph([ormModel], { relate: true })
		return opts.refetch
			? q as any
			: q.returning('*') as any
	}

	/**
	 * @override
	 */
	protected $buildPatchQuery(query: QueryBuilder<ProductORM>, model: Partial<Product>, ormModel: ProductORM,
		opts: p.RepositoryPatchOptions): p.QueryCallbackReturn {

		const q = query.upsertGraph([ormModel], { relate: true, unrelate: true, insertMissing: false })
		return opts.refetch
			? q as any
			: q.returning('*') as any
	}


	/**
	 * @see IRepository.pageActive
	 */
	public async pageRecalled(opts: p.RepositoryPageOptions): Promise<PagedData<Product>> {
		type PageResult = { total: number, results: Array<ProductORM> }
		const foundList: PageResult = await this.$executeQuery((query) => {
			const q = this._buildPageWithFilter(query, opts) as QueryBuilder<any>
			debug('PAGE RECALLED: %s', q.toSql())
			return q
		}, opts.atomicSession)

		if (!foundList) {
			return new PagedData<Product>()
		}
		const dtoList: Product[] = this.$toDomainModelMany(foundList.results)
		return new PagedData<Product>(dtoList, foundList.total)
	}

	/**
	 * @override
	 */
	private _buildPageWithFilter(
		query: QueryBuilder<ProductORM>,
		opts: p.RepositoryPageOptions,
	): p.QueryCallbackReturn {
		const q = super.$buildPageQuery(query, opts) as QueryBuilder<ProductORM>
		void q.where('status', ProductStatus.RECALLED)
		return q
	}
}
