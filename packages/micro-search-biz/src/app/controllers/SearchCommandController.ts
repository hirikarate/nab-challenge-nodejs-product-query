/* eslint-disable @typescript-eslint/indent */
/// <reference types="debug" />
const debug: debug.IDebugger = require('debug')('nab:ctrl:product')

import * as cm from '@micro-fleet/common'

const { inject } = cm.decorators
import { decorators as d } from '@micro-fleet/service-communication'

import { Types as T } from '../constants/Types'
import * as dto from '../contracts/dto/search'
import * as pdto from '../contracts-product-management/dto/product'
import { ISearchCommandService } from '../contracts/interfaces/ISearchCommandService'
import { IProductService } from '../contracts-product-management/interfaces/IProductService'
import { trustPayload } from '../utils/controller-util'


/**
 * Listens to message broker and takes actions when product operations occur.
 */
@d.mediateController()
export default class SearchCommandController {
	constructor(
		@inject(T.SEARCH_COMMAND_SVC) private _searchSvc: ISearchCommandService,
		@inject(T.PRODUCT_SVC) private _productSvc: IProductService,
	) {
		debug('SearchCommandController instantiated')
	}

	/*
	 * Topic for all actions here:
	 * `request.{MODULE_NAME}.{Action.NAME}`
	 */


	/**
	 * Catches the response when a product is created and creates a corrensponding search index for it.
	 */
	@d.action(`response.${pdto.MODULE_NAME}.${pdto.Action.CREATE}.*`, true)
	public async createIndex(
		@d.resolveFn() resolve: Function, // Not calling
		@trustPayload() params: pdto.CreateProductResponse,
	): Promise<void> {
		if (!params || !params.hasData) { return }

		const productResponse = await this._fetchProduct(params.id)
		if (!productResponse.hasData) { return }

		const indexRequest = dto.CreateIndexRequest.from({
			...productResponse,
			branchIds: productResponse.branches?.map(b => b.id),
		})
		this._searchSvc.createIndex(indexRequest).catch(console.error)
	}

	/**
	 * Catches the response when a product is modified and updates the corrensponding search index.
	 */
	@d.action(`response.${pdto.MODULE_NAME}.${pdto.Action.EDIT}.*`, true)
	public async editIndex(
		@d.resolveFn() resolve: Function, // Not calling
		@trustPayload() params: pdto.EditProductResponse,
	): Promise<void> {
		if (!params || !params.hasData) { return }

		const productResponse = await this._fetchProduct(params.id)
		if (!productResponse.hasData) { return }

		const indexRequest = dto.EditIndexRequest.from({
			...productResponse,
			branchIds: productResponse.branches?.map(b => b.id),
		})
		await this._searchSvc.editIndex(indexRequest).catch(console.error)
	}

	/**
	 * Catches the response when a product is deleted and removes the corrensponding search index.
	 */
	@d.action(`response.${pdto.MODULE_NAME}.${pdto.Action.HARD_DELETE}.*`, true)
	public deleteIndex(
		@d.resolveFn() resolve: Function, // Not calling
		@trustPayload() params: pdto.DeleteProductResponse,
	): void {
		if (!params || !params.hasData) { return }

		const indexRequest = dto.DeleteIndexRequest.from(params)
		this._searchSvc.hardDelete(indexRequest).catch(console.error)
	}


	private _fetchProduct(id: string) {
		const productRequest = pdto.GetProductByIdRequest.from({
			id,
			fields: pdto.PRODUCT_FIELDS,
			relations: pdto.PRODUCT_RELATIONS,
		})
		return this._productSvc.getById(productRequest)
	}
}
