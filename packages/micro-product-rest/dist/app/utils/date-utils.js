"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.currentUnixTimestamp = exports.momentifyUnix = exports.momentify = exports.isValidUTC = void 0;
const moment = require("moment");
/**
 * Converts a UTC time string to W3C Date and Time Formats.
 * If the input is not parseable by "moment",
 * the function returns the original string.
 */
function isValidUTC(source) {
    if (!source) {
        return false;
    }
    return moment.utc(source).isValid();
}
exports.isValidUTC = isValidUTC;
/**
 * Wraps `source` in a UTC moment object
 */
function momentify(source) {
    return moment.utc(source);
}
exports.momentify = momentify;
/**
 * Creates a UTC moment object from Unix Epoch Timestamp in seconds
 */
function momentifyUnix(timestampSec) {
    return moment.unix(timestampSec).utc();
}
exports.momentifyUnix = momentifyUnix;
/**
 * Returns Unix Epoch Timestamp of current time in seconds
 */
function currentUnixTimestamp() {
    return moment.utc().unix();
}
exports.currentUnixTimestamp = currentUnixTimestamp;
// export function stringify(...source: any[]): string | string[] {
// 	if (source.length === 1) {
// 		if (Array.isArray(source[0])) {
// 			return [source[0] + '']
// 		}
// 		return source[0] + ''
// 	}
// 	return source.map(s => s + '')
// }
//# sourceMappingURL=date-utils.js.map