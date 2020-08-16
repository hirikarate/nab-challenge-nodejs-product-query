import * as dto from '../dto/search'


/**
 * Provides methods for searching operations
 */
export interface ISearchQueryService {
	/**
	 * Searches with multiple criteria
	 */
	searchAdvanced: (params: dto.SearchAdvancedRequest) => Promise<dto.SearchAdvancedResponse>
}
