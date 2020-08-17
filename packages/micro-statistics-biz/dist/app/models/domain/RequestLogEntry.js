"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestLogEntry = void 0;
const common_1 = require("@micro-fleet/common");
const date_utils_1 = require("../../utils/date-utils");
/**
 * Represents a log entry keeping tracks of request to API services.
 */
class RequestLogEntry extends common_1.Translatable {
    constructor() {
        super(...arguments);
        /**
         * Gets or sets the big-int ID
         */
        this.id = undefined;
        /**
         * Gets or sets the requested operation. E.g: getProductById, filterProduct...
         */
        this.operationName = undefined;
        /**
         * Gets or sets client's IP address or comma-separated list of addresses,
         * in case the API service is behind proxy/-ies.
         */
        this.ipAddress = undefined;
        /**
         * Gets or sets device name (if request is made from mobile app)
         * or user agent string (if from browser).
         */
        this.deviceName = undefined;
        /**
         * Gets or sets content of the request.
         */
        this.requestPayload = undefined;
        /**
         * Gets or sets the UTC ISO string when this entry is logged.
         */
        this.createdAt = undefined;
    }
    /**
     * Gets the Moment instance of createdAt.
     */
    get createdMoment() {
        return date_utils_1.momentify(this.createdAt);
    }
}
exports.RequestLogEntry = RequestLogEntry;
//# sourceMappingURL=RequestLogEntry.js.map