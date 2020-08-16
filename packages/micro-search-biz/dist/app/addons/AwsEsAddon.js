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
exports.AwsEsAddOn = void 0;
/// <reference types="debug" />
const debug = require('debug')('nab:addon:awses');
const AWS = require("aws-sdk");
const elasticsearch_1 = require("@elastic/elasticsearch");
const createAwsConnector = require("aws-elasticsearch-connector");
const common_1 = require("@micro-fleet/common");
const SettingKeys_1 = require("../constants/SettingKeys");
const Types_1 = require("../constants/Types");
/**
 * Initializes AWS ElasticSearch instance.
 */
let AwsEsAddOn = class AwsEsAddOn {
    constructor(_config, _diContainer) {
        this._config = _config;
        this._diContainer = _diContainer;
        this.name = 'AwsAddOn';
        common_1.Guard.assertArgDefined('Configuration provider', _config);
        common_1.Guard.assertArgDefined('Dependency container', _diContainer);
    }
    /**
     * @see IServiceAddOn.init
     */
    init() {
        this._initClient();
        this._diContainer.bindConstant(Types_1.Types.ELASTIC_SEARCH_CLIENT, this._client);
        return this._initIndices();
    }
    /**
     * @see IServiceAddOn.deadLetter
     */
    deadLetter() {
        return Promise.resolve();
    }
    /**
     * @see IServiceAddOn.dispose
     */
    async dispose() {
        return Promise.resolve();
    }
    _initClient() {
        const domainMaybe = this._config.get(SettingKeys_1.ElasticSearch.HOST);
        const accessMaybe = this._config.get(SettingKeys_1.AWS.ACCESS_KEY);
        const secretMaybe = this._config.get(SettingKeys_1.AWS.SECRET_KEY);
        const regionMaybe = this._config.get(SettingKeys_1.AWS.REGION);
        if (regionMaybe.isJust && accessMaybe.isJust && secretMaybe.isJust) {
            AWS.config.update({
                credentials: new AWS.Credentials(accessMaybe.value, secretMaybe.value),
                region: regionMaybe.value,
            });
        }
        this._client = new elasticsearch_1.Client({
            ...createAwsConnector(AWS.config),
            node: domainMaybe.value,
        });
    }
    /**
     * Creates index mappings if they don't exist.
     */
    async _initIndices() {
        const mappings = this._config.get(SettingKeys_1.ElasticSearch.MAPPINGS).tryGetValue([]);
        await Promise.all(mappings.map(async (m) => {
            debug(`Checking index "${m.index}"...`);
            if (await this._createIndexIfNotExist(m.index)) {
                return;
            }
            debug(`Creating mapping "${m.index}"...`);
            await this._createMapping(m);
        }));
    }
    /**
     * @returns `true` if index already exists, `false` if it doesn't and needs creating
     */
    async _createIndexIfNotExist(index) {
        const params = {
            index,
        };
        const { body: isExisting } = await this._client.indices.exists(params);
        if (isExisting) {
            return true;
        }
        await this._client.indices.create(params);
        return false;
    }
    _createMapping(mapping) {
        return this._client.indices.putMapping(mapping);
    }
};
AwsEsAddOn = __decorate([
    common_1.decorators.injectable(),
    __param(0, common_1.decorators.inject(common_1.Types.CONFIG_PROVIDER)),
    __param(1, common_1.decorators.inject(common_1.Types.DEPENDENCY_CONTAINER)),
    __metadata("design:paramtypes", [Object, Object])
], AwsEsAddOn);
exports.AwsEsAddOn = AwsEsAddOn;
//# sourceMappingURL=AwsEsAddon.js.map