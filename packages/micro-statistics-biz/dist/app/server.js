"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const id_generator_1 = require("@micro-fleet/id-generator");
const microservice_1 = require("@micro-fleet/microservice");
const persistence_1 = require("@micro-fleet/persistence");
const service_communication_1 = require("@micro-fleet/service-communication");
const Types_1 = require("./constants/Types");
const StatisticsService_1 = require("./services/StatisticsService");
const RequestLogRepository_1 = require("./repositories/RequestLogRepository");
class App extends microservice_1.MicroServiceBase {
    /**
     * @override
     */
    $registerDependencies() {
        super.$registerDependencies();
        const dc = this._depContainer;
        dc.bindConstructor(Types_1.Types.REQUEST_LOG_REPO, RequestLogRepository_1.RequestLogRepository).asSingleton();
        dc.bindConstructor(Types_1.Types.STATISTICS_SVC, StatisticsService_1.StatisticsService).asSingleton();
    }
    /**
     * @override
     */
    $onStarting() {
        super.$onStarting();
        this.attachAddOn(persistence_1.registerDbAddOn());
        this.attachAddOn(id_generator_1.registerIdAddOn());
        this.attachAddOn(service_communication_1.registerMessageBrokerAddOn());
        // If no error handler is registered to RPC handler
        // Uncaught errors will be thrown as normal exceptions.
        const serviceOnError = this.$onError.bind(this);
        const rpcHandler = service_communication_1.registerMediateHandlerAddOn();
        rpcHandler.onError(serviceOnError);
        this.attachAddOn(rpcHandler);
    }
}
new App().start().catch(console.error);
//# sourceMappingURL=server.js.map