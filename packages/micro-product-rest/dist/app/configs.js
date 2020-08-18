"use strict";
const path = require("path");
const common_1 = require("@micro-fleet/common");
const AuthSettingKeys_1 = require("./constants/AuthSettingKeys");
const { Cache: C, Service: S, MessageBroker: M, RPC, Web: W, } = common_1.constants;
const cwd = process.cwd();
module.exports = {
    [S.SERVICE_SLUG]: 'nab-product-rest-service',
    [AuthSettingKeys_1.Auth.AUTH_EXPIRE_ACCESS]: '30m',
    [AuthSettingKeys_1.Auth.AUTH_EXPIRE_REFRESH]: '30d',
    [AuthSettingKeys_1.Auth.AUTH_ISSUER]: 'www.nab.com.au',
    [AuthSettingKeys_1.Auth.AUTH_KEY_SIGN_FILE]: path.resolve(cwd, './_encrypt-key/privatekey.pem'),
    [AuthSettingKeys_1.Auth.AUTH_KEY_VERIFY_FILE]: path.resolve(cwd, './_encrypt-key/publickey.crt'),
    [C.CACHE_NUM_CONN]: 1,
    [C.CACHE_HOST]: 'localhost',
    [M.MSG_BROKER_HOST]: 'localhost',
    [M.MSG_BROKER_USERNAME]: 'guest',
    [M.MSG_BROKER_PASSWORD]: 'guest',
    [M.MSG_BROKER_EXCHANGE]: 'amq.topic',
    [M.MSG_BROKER_MSG_EXPIRE]: 30e3,
    [RPC.RPC_CALLER_TIMEOUT]: 30e3,
    [W.WEB_PORT]: 3000,
    [W.WEB_URL_PREFIX]: '/api/v1',
    [W.WEB_CORS]: '*',
};
//# sourceMappingURL=configs.js.map