"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatisticsService = void 0;
/* eslint-disable @typescript-eslint/indent */
/// <reference types="debug" />
const debug = require('debug')('nab:svc:statistics');
const common_1 = require("@micro-fleet/common");
const id_generator_1 = require("@micro-fleet/id-generator");
const persistence_1 = require("@micro-fleet/persistence");
const Types_1 = require("../constants/Types");
const dto = require("../contracts/dto/statistics");
const RequestLogEntry_1 = require("../models/domain/RequestLogEntry");
const ManagementServiceBase_1 = require("./ManagementServiceBase");
let StatisticsService = class StatisticsService extends ManagementServiceBase_1.ManagementServiceBase {
    constructor(sessionFactory, repo, _idGen) {
        super(RequestLogEntry_1.RequestLogEntry, repo, sessionFactory);
        this._idGen = _idGen;
        debug('StatisticsService instantiated');
    }
    /**
     * @see IStatisticsService.create
     */
    create(params) {
        return this.$create({
            ...params,
            id: this._idGen.nextBigInt(),
        }, dto.CreateStatisticsResponse);
    }
};
StatisticsService = __decorate([
    __param(0, common_1.decorators.inject(persistence_1.Types.ATOMIC_SESSION_FACTORY)),
    __param(1, common_1.decorators.inject(Types_1.Types.REQUEST_LOG_REPO)),
    __param(2, common_1.decorators.inject(id_generator_1.Types.ID_PROVIDER)),
    __metadata("design:paramtypes", [persistence_1.AtomicSessionFactory, Object, Object])
], StatisticsService);
exports.StatisticsService = StatisticsService;
//# sourceMappingURL=StatisticsService.js.map