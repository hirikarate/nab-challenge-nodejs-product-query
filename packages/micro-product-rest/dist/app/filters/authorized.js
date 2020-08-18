"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorized = void 0;
const web_1 = require("@micro-fleet/web");
const AuthorizeFilter_1 = require("./AuthorizeFilter");
/**
 * Marks a controller or action to require authentication token to be accessible.
 */
function authorized() {
    return function (TargetClass, key) {
        return web_1.addFilterToTarget(AuthorizeFilter_1.AuthorizeFilter, TargetClass, key, web_1.FilterPriority.HIGH);
    };
}
exports.authorized = authorized;
//# sourceMappingURL=authorized.js.map