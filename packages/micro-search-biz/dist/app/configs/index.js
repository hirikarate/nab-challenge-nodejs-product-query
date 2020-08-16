"use strict";
const common_1 = require("@micro-fleet/common");
const SettingKeys_1 = require("../constants/SettingKeys");
const mapping_product_1 = require("./mapping-product");
const { Cache: C, MessageBroker: M, Service: S, RPC, } = common_1.constants;
module.exports = {
    [S.SERVICE_SLUG]: 'nab-product-search-biz-service',
    [SettingKeys_1.AWS.REGION]: 'ap-southeast-1',
    [SettingKeys_1.AWS.ACCESS_KEY]: 'AKIAWCNSVEYMSWGV3NM6',
    [SettingKeys_1.AWS.SECRET_KEY]: '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',
    [C.CACHE_NUM_CONN]: 0,
    [C.CACHE_HOST]: 'localhost',
    [SettingKeys_1.ElasticSearch.HOST]: 'https://search-icommerce-7htb7n5ittiwrpm5iwcdomp6l4.ap-southeast-1.es.amazonaws.com/',
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
    [RPC.RPC_HANDLER_PORT]: 8080,
};
//# sourceMappingURL=index.js.map