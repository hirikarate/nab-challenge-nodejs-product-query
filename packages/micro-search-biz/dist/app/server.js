"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const common_1 = require("@micro-fleet/common");
const cache_1 = require("@micro-fleet/cache");
const microservice_1 = require("@micro-fleet/microservice");
const service_communication_1 = require("@micro-fleet/service-communication");
const Types_1 = require("./constants/Types");
const ElasticSearchService_1 = require("./services/ElasticSearchService");
const RemoteProductService_1 = require("./services/RemoteProductService");
const AwsEsAddon_1 = require("./addons/AwsEsAddon");
const { Service: S, MessageBroker: MB, RPC, } = common_1.constants;
class App extends microservice_1.MicroServiceBase {
    /**
     * @override
     */
    $registerDependencies() {
        super.$registerDependencies();
        const dc = this._depContainer;
        dc.bindConstructor(Types_1.Types.SEARCH_COMMAND_SVC, ElasticSearchService_1.ElasticSearchService).asSingleton();
        dc.bindConstructor(Types_1.Types.SEARCH_QUERY_SVC, ElasticSearchService_1.ElasticSearchService).asSingleton();
        dc.bindConstructor(Types_1.Types.PRODUCT_SVC, RemoteProductService_1.RemoteProductService).asSingleton();
    }
    /**
     * @override
     */
    $onStarting() {
        super.$onStarting();
        this.attachAddOn(cache_1.registerCacheAddOn());
        this.attachAddOn(service_communication_1.registerMessageBrokerAddOn());
        // If no error handler is registered to RPC handler
        // Uncaught errors will be thrown as normal exceptions.
        const serviceOnError = this.$onError.bind(this);
        const rpcHandlerMediate = service_communication_1.registerMediateHandlerAddOn();
        rpcHandlerMediate.onError(serviceOnError);
        rpcHandlerMediate.controllerPath = path.resolve(__dirname, 'controllers/mediate-controllers');
        this.attachAddOn(rpcHandlerMediate);
        const rpcHandlerDirect = service_communication_1.registerDirectHandlerAddOn();
        rpcHandlerDirect.onError(serviceOnError);
        rpcHandlerDirect.controllerPath = path.resolve(__dirname, 'controllers/direct-controllers');
        this.attachAddOn(rpcHandlerDirect);
        const dc = this._depContainer;
        dc.bindConstructor(Types_1.Types.AWS_ELASTIC_SEARCH_ADDON, AwsEsAddon_1.AwsEsAddOn).asSingleton();
        this.attachAddOn(dc.resolve(Types_1.Types.AWS_ELASTIC_SEARCH_ADDON));
    }
    $onStarted() {
        super.$onStarted();
        this._initRpcCaller().catch(err => this.$onError(err));
    }
    async _initRpcCaller() {
        service_communication_1.registerMediateCaller();
        const config = this._configProvider;
        const caller = this._depContainer.resolve(service_communication_1.Types.MEDIATE_RPC_CALLER);
        await caller.init({
            callerName: config.get(S.SERVICE_SLUG).value,
            messageExpiredIn: config.get(MB.MSG_BROKER_MSG_EXPIRE, common_1.SettingItemDataType.Number).value,
            timeout: config.get(RPC.RPC_CALLER_TIMEOUT, common_1.SettingItemDataType.Number).value,
        });
    }
}
new App().start().catch(console.error);
//# sourceMappingURL=server.js.map