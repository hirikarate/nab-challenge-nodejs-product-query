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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizeFilter = void 0;
// import * as express from 'express'
const common_1 = require("@micro-fleet/common");
const web_1 = require("@micro-fleet/web");
const Types_1 = require("../constants/Types");
const dto = require("../contracts/dto/auth");
class AuthorizeFilter extends web_1.ActionFilterBase {
    async execute(request, response, next) {
        try {
            const result = await this._authorizeRequest(request);
            if (result.isFailure) {
                response.status(401).send(new UnauthorizeResponse(result.error));
                return;
            }
            this.addReadonlyProp(request, 'user', result.value);
            next();
        }
        catch (err) {
            console.error(err);
            response.sendStatus(401); // 401 Unthorized
        }
    }
    _extractToken(request) {
        const header = request.headers['authorization'] || '';
        return header.slice('Bearer '.length);
    }
    async _authorizeRequest(request) {
        const accessToken = this._extractToken(request);
        if (!accessToken) {
            return common_1.Result.Failure('NO_ACCESS_TOKEN');
        }
        const params = dto.DecodeAccessTokenRequest.from({
            accessToken,
        });
        const result = await this._authSvc.decodeAccessToken(params);
        return result.toResult();
    }
}
__decorate([
    common_1.decorators.lazyInject(Types_1.Types.AUTH_SVC),
    __metadata("design:type", Object)
], AuthorizeFilter.prototype, "_authSvc", void 0);
exports.AuthorizeFilter = AuthorizeFilter;
class UnauthorizeResponse {
    constructor(error) {
        this.error = error;
        this.hasData = false;
    }
}
//# sourceMappingURL=AuthorizeFilter.js.map