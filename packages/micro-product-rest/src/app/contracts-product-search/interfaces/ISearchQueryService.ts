import * as dto from '../dto/search'


/**
 * Provides methods for searching operations
 */
export interface ISearchQueryService {
	/**
	 * Gets a subset of products with filter criteria
	 */
	filter: (params: dto.FilterRequest) => Promise<dto.SearchResponse>

	/**
	 * Searches keywords with multiple criteria.
	 * E.g: "Red Ferrari" will match products with name containing "Ferrari" and
	 * color including "Red" keywords.
	 */
	searchAdvanced: (params: dto.SearchAdvancedRequest) => Promise<dto.SearchResponse>
}
