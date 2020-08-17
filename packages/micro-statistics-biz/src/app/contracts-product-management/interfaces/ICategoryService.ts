import * as dto from '../dto/category'

/**
 * Provides methods for common CRUD operations
 */
export interface ICategoryService {
	/**
	 * Creates new category
	 */
	create: (params: dto.CreateCategoryRequest) => Promise<dto.CreateCategoryResponse>

	/**
	 * Modifies some properties of a category
	 */
	edit: (params: dto.EditCategoryRequest) => Promise<dto.EditCategoryResponse>

	/**
	 * Gets a category's details
	 */
	getById: (params: dto.GetCategoryByIdRequest) => Promise<dto.GetSingleCategoryResponse>

	/**
	 * Gets a paged list of categories
	 */
	getList: (params: dto.GetCategoryListRequest) => Promise<dto.GetCategoryListResponse>

	/**
	 * Permanently deletes a category and optionally its associated products.
	 */
	hardDeleteSingle: (params: dto.DeleteCategoryRequest) => Promise<dto.DeleteCategoryResponse>

	/**
	 * Permanently deletes many categories and optionally their associated products.
	 */
	hardDeleteMany: (params: dto.DeleteCategoryRequest) => Promise<dto.DeleteCategoryResponse>
}
