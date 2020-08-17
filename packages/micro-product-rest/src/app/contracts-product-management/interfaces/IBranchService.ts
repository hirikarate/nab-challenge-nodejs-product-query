import * as dto from '../dto/branch'


/**
 * Provides methods for common CRUD operations
 */
export interface IBranchService {
	/**
	 * Creates new branch
	 */
	create: (params: dto.CreateBranchRequest) => Promise<dto.CreateBranchResponse>

	/**
	 * Modifies some properties of a branch
	 */
	edit: (params: dto.EditBranchRequest) => Promise<dto.EditBranchResponse>

	/**
	 * Gets a branch's details
	 */
	getById: (params: dto.GetBranchByIdRequest) => Promise<dto.GetSingleBranchResponse>

	/**
	 * Gets a paged list of branches
	 */
	getList: (params: dto.GetBranchListRequest) => Promise<dto.GetBranchListResponse>

	/**
	 * Permanently deletes a branch and optionally its associated products.
	 */
	hardDeleteSingle: (params: dto.DeleteBranchRequest) => Promise<dto.DeleteBranchResponse>

	/**
	 * Permanently deletes many branches and optionally their associated products.
	 */
	hardDeleteMany: (params: dto.DeleteBranchRequest) => Promise<dto.DeleteBranchResponse>
}
