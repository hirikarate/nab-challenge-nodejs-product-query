import { Moment } from 'moment'
import { Translatable } from '@micro-fleet/common'

import { momentify } from '../../utils/date-utils'


/**
 * Represents a log entry keeping tracks of request to API services.
 */
export class RequestLogEntry extends Translatable {
	/**
	 * Gets or sets the big-int ID
	 */
	public id: string = undefined

	/**
	 * Gets or sets the requested operation. E.g: getProductById, filterProduct...
	 */
	public operationName: string = undefined

	/**
	 * Gets or sets client's IP address or comma-separated list of addresses,
	 * in case the API service is behind proxy/-ies.
	 */
	public ipAddress: string = undefined

	/**
	 * Gets or sets device name (if request is made from mobile app)
	 * or user agent string (if from browser).
	 */
	public deviceName: string = undefined

	/**
	 * Gets or sets content of the request.
	 */
	public requestPayload: object = undefined

	/**
	 * Gets or sets the UTC ISO string when this entry is logged.
	 */
	public createdAt: string = undefined

	/**
	 * Gets the Moment instance of createdAt.
	 */
	public get createdMoment(): Moment {
		return momentify(this.createdAt)
	}
}
