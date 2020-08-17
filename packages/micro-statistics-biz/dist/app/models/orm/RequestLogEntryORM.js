"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestLogEntryORM = void 0;
const common_1 = require("@micro-fleet/common");
const persistence_1 = require("@micro-fleet/persistence");
const date_utils_1 = require("../../utils/date-utils");
let RequestLogEntryORM = class RequestLogEntryORM extends persistence_1.ORMModelBase {
    constructor() {
        super(...arguments);
        this.id = undefined;
        this.operationName = undefined;
        this.ipAddress = undefined;
        this.deviceName = undefined;
        this.requestPayload = undefined;
        this.createdAt = undefined;
    }
    /**
     * @override
     */
    static get tableName() {
        return 'public.nab_request_logs';
    }
    /**
     * [ObjectionJS]
     */
    $beforeInsert(queryContext) {
        void super.$beforeInsert(queryContext);
        this.createdAt = date_utils_1.momentify().format();
    }
    /**
     * [ObjectionJS]
     * This method converts the JSON object from the database format
     * to the entity class.
     */
    $parseDatabaseJson(json) {
        const entityProps = super.$parseDatabaseJson(json);
        return {
            ...entityProps,
            createdAt: date_utils_1.toUtcTimeString(json.createdAt),
        };
    }
};
RequestLogEntryORM = __decorate([
    common_1.decorators.translatable()
], RequestLogEntryORM);
exports.RequestLogEntryORM = RequestLogEntryORM;
//# sourceMappingURL=RequestLogEntryORM.js.map