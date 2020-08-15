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
exports.BranchRepository = void 0;
/// <reference types="debug" />
const debug = require('debug')('nab:repo:branch');
const common_1 = require("@micro-fleet/common");
const p = require("@micro-fleet/persistence");
const Branch_1 = require("../models/domain/Branch");
const BranchORM_1 = require("../models/orm/BranchORM");
let BranchRepository = class BranchRepository extends p.PgCrudRepositoryBase {
    constructor(connector) {
        super(BranchORM_1.BranchORM, Branch_1.Branch, connector);
        debug('BranchRepository instantiated');
    }
};
BranchRepository = __decorate([
    __param(0, common_1.decorators.inject(p.Types.DB_CONNECTOR)),
    __metadata("design:paramtypes", [Object])
], BranchRepository);
exports.BranchRepository = BranchRepository;
//# sourceMappingURL=BranchRepository.js.map