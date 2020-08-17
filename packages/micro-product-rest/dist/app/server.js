"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@micro-fleet/common");
const cache_1 = require("@micro-fleet/cache");
const microservice_1 = require("@micro-fleet/microservice");
const service_communication_1 = require("@micro-fleet/service-communication");
const web_1 = require("@micro-fleet/web");
const Types_1 = require("./constants/Types");
const RemoteBranchService_1 = require("./services/RemoteBranchService");
const RemoteCategoryService_1 = require("./services/RemoteCategoryService");
const RemoteProductDirectService_1 = require("./services/RemoteProductDirectService");
const RemoteProductMediateService_1 = require("./services/RemoteProductMediateService");
const RemoteSearchQueryService_1 = require("./services/RemoteSearchQueryService");
const { Service: S, MessageBroker: MB, RPC, } = common_1.constants;
class App extends microservice_1.MicroServiceBase {
    /**
     * @override
     */
    $registerDependencies() {
        super.$registerDependencies();
        const dc = this._depContainer;
        dc.bindConstructor(Types_1.Types.BRANCH_SVC, RemoteBranchService_1.RemoteBranchService).asSingleton();
        dc.bindConstructor(Types_1.Types.CATEGORY_SVC, RemoteCategoryService_1.RemoteCategoryService).asSingleton();
        dc.bindConstructor(Types_1.Types.PRODUCT_DIRECT_SVC, RemoteProductDirectService_1.RemoteProductDirectService).asSingleton();
        dc.bindConstructor(Types_1.Types.PRODUCT_MEDIATE_SVC, RemoteProductMediateService_1.RemoteProductMediateService).asSingleton();
        dc.bindConstructor(Types_1.Types.SEARCH_SVC, RemoteSearchQueryService_1.RemoteSearchQueryService).asSingleton();
    }
    /**
     * @override
     */
    $onStarting() {
        super.$onStarting();
        this.attachAddOn(cache_1.registerCacheAddOn());
        this.attachAddOn(web_1.registerWebAddOn());
        this.attachAddOn(service_communication_1.registerMessageBrokerAddOn());
    }
    $onStarted() {
        super.$onStarted();
        this._initDirectRpcCaller();
        this._initMediateRpcCaller();
    }
    _initDirectRpcCaller() {
        service_communication_1.registerDirectCaller();
        const config = this._configProvider;
        const caller = this._depContainer.resolve(service_communication_1.Types.DIRECT_RPC_CALLER);
        void caller.init({
            callerName: config.get(S.SERVICE_SLUG).value,
            baseAddress: 'localhost:8181',
        });
    }
    _initMediateRpcCaller() {
        service_communication_1.registerMediateCaller();
        const config = this._configProvider;
        const caller = this._depContainer.resolve(service_communication_1.Types.MEDIATE_RPC_CALLER);
        void caller.init({
            callerName: config.get(S.SERVICE_SLUG).value,
            messageExpiredIn: config.get(MB.MSG_BROKER_MSG_EXPIRE, common_1.SettingItemDataType.Number).value,
            timeout: config.get(RPC.RPC_CALLER_TIMEOUT, common_1.SettingItemDataType.Number).value,
        });
    }
}
new App().start().catch(console.error);
//# sourceMappingURL=server.js.map