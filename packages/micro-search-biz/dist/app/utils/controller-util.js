"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trustPayload = void 0;
const service_communication_1 = require("@micro-fleet/service-communication");
function trustPayload(ItemClass) {
    return service_communication_1.decorators.payload({
        ItemClass,
        enableValidation: false,
    });
}
exports.trustPayload = trustPayload;
//# sourceMappingURL=controller-util.js.map