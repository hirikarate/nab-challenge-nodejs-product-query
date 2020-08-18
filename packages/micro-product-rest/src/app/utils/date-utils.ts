import * as moment from 'moment'

/**
 * Converts a UTC time string to W3C Date and Time Formats.
 * If the input is not parseable by "moment",
 * the function returns the original string.
 */
export function isValidUTC(source: string): boolean {
	if (!source) { return false }
	return moment.utc(source).isValid()
}

/**
 * Wraps `source` in a UTC moment object
 */
export function momentify(source?: any): moment.Moment {
	return moment.utc(source)
}

/**
 * Creates a UTC moment object from Unix Epoch Timestamp in seconds
 */
export function momentifyUnix(timestampSec?: number): moment.Moment {
	return moment.unix(timestampSec).utc()
}

/**
 * Returns Unix Epoch Timestamp of current time in seconds
 */
export function currentUnixTimestamp(): number {
	return moment.utc().unix()
}

// export function stringify(...source: any[]): string | string[] {
// 	if (source.length === 1) {
// 		if (Array.isArray(source[0])) {
// 			return [source[0] + '']
// 		}
// 		return source[0] + ''
// 	}
// 	return source.map(s => s + '')
// }
