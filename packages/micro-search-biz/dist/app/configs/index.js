"use strict";
const common_1 = require("@micro-fleet/common");
const SettingKeys_1 = require("../constants/SettingKeys");
const mapping_product_1 = require("./mapping-product");
const { MessageBroker: M, Service: S, RPC, } = common_1.constants;
module.exports = {
    [S.SERVICE_SLUG]: 'nab-product-search-biz-service',
    [SettingKeys_1.AWS.REGION]: 'ap-southeast-1',
    [SettingKeys_1.AWS.ACCESS_KEY]: 'ACCESS_KEY',
    [SettingKeys_1.AWS.SECRET_KEY]: 'SECRET_KEY',
    [SettingKeys_1.ElasticSearch.HOST]: 'https://ap-southeast-1.es.amazonaws.com/',
    [SettingKeys_1.ElasticSearch.MAPPINGS]: [
        ...mapping_product_1.default,
    ],
    [M.MSG_BROKER_HOST]: 'localhost',
    [M.MSG_BROKER_USERNAME]: 'guest',
    [M.MSG_BROKER_PASSWORD]: 'guest',
    [M.MSG_BROKER_EXCHANGE]: 'amq.topic',
    [M.MSG_BROKER_HANDLER_QUEUE]: 'nab-product-search-biz-handler',
    [M.MSG_BROKER_MSG_EXPIRE]: 30e3,
    [RPC.RPC_CALLER_TIMEOUT]: 30e3,
};
//# sourceMappingURL=index.js.map