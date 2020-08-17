"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const id_generator_1 = require("@micro-fleet/id-generator");
const microservice_1 = require("@micro-fleet/microservice");
const persistence_1 = require("@micro-fleet/persistence");
const service_communication_1 = require("@micro-fleet/service-communication");
const Types_1 = require("./constants/Types");
const BranchService_1 = require("./services/BranchService");
const BranchRepository_1 = require("./repositories/BranchRepository");
const CategoryService_1 = require("./services/CategoryService");
const CategoryRepository_1 = require("./repositories/CategoryRepository");
const ProductService_1 = require("./services/ProductService");
const ProductRepository_1 = require("./repositories/ProductRepository");
class App extends microservice_1.MicroServiceBase {
    /**
     * @override
     */
    $registerDependencies() {
        super.$registerDependencies();
        const dc = this._depContainer;
        dc.bindConstructor(Types_1.Types.BRANCH_REPO, BranchRepository_1.BranchRepository).asSingleton();
        dc.bindConstructor(Types_1.Types.BRANCH_SVC, BranchService_1.BranchService).asSingleton();
        dc.bindConstructor(Types_1.Types.CATEGORY_REPO, CategoryRepository_1.CategoryRepository).asSingleton();
        dc.bindConstructor(Types_1.Types.CATEGORY_SVC, CategoryService_1.CategoryService).asSingleton();
        dc.bindConstructor(Types_1.Types.PRODUCT_REPO, ProductRepository_1.ProductRepository).asSingleton();
        dc.bindConstructor(Types_1.Types.PRODUCT_SVC, ProductService_1.ProductService).asSingleton();
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
        const rpcHandlerMediate = service_communication_1.registerMediateHandlerAddOn();
        rpcHandlerMediate.onError(serviceOnError);
        rpcHandlerMediate.controllerPath = path.resolve(__dirname, 'controllers/mediate-controllers');
        this.attachAddOn(rpcHandlerMediate);
        const rpcHandlerDirect = service_communication_1.registerDirectHandlerAddOn();
        rpcHandlerDirect.onError(serviceOnError);
        rpcHandlerDirect.controllerPath = path.resolve(__dirname, 'controllers/direct-controllers');
        this.attachAddOn(rpcHandlerDirect);
    }
}
new App().start().catch(console.error);
//# sourceMappingURL=server.js.map