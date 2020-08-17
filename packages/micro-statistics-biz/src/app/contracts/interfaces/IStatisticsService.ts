import * as dto from '../dto/statistics'

/**
 * Provides methods for statistics operations
 */
export interface IStatisticsService {
	/**
	 * Logs a request for statistics purpose.
	 */
	create: (params: dto.CreateStatisticsRequest) => Promise<dto.CreateStatisticsResponse>
}
