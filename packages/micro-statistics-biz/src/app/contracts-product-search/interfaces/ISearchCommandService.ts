import * as dto from '../dto/search'


/**
 * Provides methods for searching operations
 */
export interface ISearchCommandService {
	/**
	 * Creates new search index
	 */
	createIndex: (params: dto.CreateIndexRequest) => Promise<dto.CreateIndexResponse>

	/**
	 * Modifies some properties of a search index
	 */
	editIndex: (params: dto.EditIndexRequest) => Promise<dto.EditIndexResponse>

	/**
	 * Permanently deletes one or many search indeses
	 */
	hardDelete: (params: dto.DeleteIndexRequest) => Promise<dto.DeleteIndexResponse>
}
