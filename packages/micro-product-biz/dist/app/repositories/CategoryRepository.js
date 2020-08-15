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
exports.CategoryRepository = void 0;
/// <reference types="debug" />
const debug = require('debug')('nab:repo:category');
const common_1 = require("@micro-fleet/common");
const p = require("@micro-fleet/persistence");
const Category_1 = require("../models/domain/Category");
const CategoryORM_1 = require("../models/orm/CategoryORM");
let CategoryRepository = class CategoryRepository extends p.PgCrudRepositoryBase {
    constructor(connector) {
        super(CategoryORM_1.CategoryORM, Category_1.Category, connector);
        debug('CategoryRepository instantiated');
    }
};
CategoryRepository = __decorate([
    __param(0, common_1.decorators.inject(p.Types.DB_CONNECTOR)),
    __metadata("design:paramtypes", [Object])
], CategoryRepository);
exports.CategoryRepository = CategoryRepository;
//# sourceMappingURL=CategoryRepository.js.map