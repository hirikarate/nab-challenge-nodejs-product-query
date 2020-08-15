import * as dto from '../dto/product'

/**
 * Provides methods for common CRUD operations
 */
export interface IProductService {
	/**
	 * Creates new product
	 */
	create: (params: dto.CreateProductRequest) => Promise<dto.CreateProductResponse>

	/**
	 * Modifies some properties of a product
	 */
	edit: (params: dto.EditProductRequest) => Promise<dto.EditProductResponse>

	/**
	 * Gets a product's details
	 */
	getById: (params: dto.GetProductByIdRequest) => Promise<dto.GetSingleProductResponse>

	/**
	 * Gets a paged list of products
	 */
	getList: (params: dto.GetProductListRequest) => Promise<dto.GetProductListResponse>

	/**
	 * Gets a paged list of products recalled by its manufacturer
	 */
	getRecalledList: (params: dto.GetProductListRequest) => Promise<dto.GetProductListResponse>

	/**
	 * Permanently deletes a product and optionally its associated entities.
	 */
	hardDeleteSingle: (params: dto.DeleteProductRequest) => Promise<dto.DeleteProductResponse>

	/**
	 * Permanently deletes many products and optionally their associated entities.
	 */
	hardDeleteMany: (params: dto.DeleteProductRequest) => Promise<dto.DeleteProductResponse>
}
