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
exports.GetAccessTokenBlackListResponse = exports.ExtendAccessTokenResponse = exports.ExtendAccessTokenRequest = exports.DecodeAccessTokenResponse = exports.DecodeAccessTokenRequest = exports.LogOutOAuthResponse = exports.LogOutOAuthRequest = exports.LoginOAuthRefreshResponse = exports.LoginOAuthRefreshRequest = exports.LoginOAuthNewResponse = exports.LoginOAuthNewRequest = exports.CheckCredentialsResponse = exports.CheckCredentialsRequest = exports.ACCOUNT_FIELDS = void 0;
const joi = require("@hapi/joi");
const common_1 = require("@micro-fleet/common");
const dto_base_1 = require("./dto-base");
exports.ACCOUNT_FIELDS = [
    'id', 'username', 'timezone', 'createdAt', 'updatedAt',
    'displayName', 'firstName', 'lastName', 'email',
];
// #region Authenticate
class CheckCredentialsRequest extends common_1.Translatable {
    constructor() {
        super(...arguments);
        this.username = undefined;
        this.password = undefined;
    }
}
__decorate([
    common_1.decorators.required(),
    common_1.decorators.string({ maxLength: 100 }),
    __metadata("design:type", String)
], CheckCredentialsRequest.prototype, "username", void 0);
__decorate([
    common_1.decorators.required(),
    common_1.decorators.string({ maxLength: 500 }),
    __metadata("design:type", String)
], CheckCredentialsRequest.prototype, "password", void 0);
exports.CheckCredentialsRequest = CheckCredentialsRequest;
class CheckCredentialsResponse extends dto_base_1.ResultResponse {
    constructor() {
        super(...arguments);
        this.accountId = undefined;
        this.displayName = undefined;
        this.timezone = undefined;
        this.accountStatus = undefined;
        /**
         * Gets or sets last logged in date time
         */
        this.lastLoggedInAt = undefined;
        /**
         * Gets or sets last logged in IP address
         */
        this.lastLoggedInIP = undefined;
        /**
         * Gets or sets last logged in location (estimated based on IP)
         */
        this.lastLoggedInFrom = undefined;
    }
}
exports.CheckCredentialsResponse = CheckCredentialsResponse;
class LoginOAuthNewRequest extends common_1.Translatable {
    constructor() {
        super(...arguments);
        this.username = undefined;
        this.password = undefined;
        this.appName = undefined;
        this.appDescription = undefined;
        this.deviceName = undefined;
        this.ipAddress = undefined;
        /**
         * Indicates whether refresh token should be generated or not.
         */
        this.allowRefresh = undefined;
        /**
         * Gets account fields to include in the returned access token.
         */
        this.claimFields = undefined;
    }
}
__decorate([
    common_1.decorators.required(),
    common_1.decorators.string({ maxLength: 100 }),
    __metadata("design:type", String)
], LoginOAuthNewRequest.prototype, "username", void 0);
__decorate([
    common_1.decorators.required(),
    common_1.decorators.string({ maxLength: 500 }),
    __metadata("design:type", String)
], LoginOAuthNewRequest.prototype, "password", void 0);
__decorate([
    common_1.decorators.required(),
    common_1.decorators.string({ maxLength: 100 }),
    __metadata("design:type", String)
], LoginOAuthNewRequest.prototype, "appName", void 0);
__decorate([
    common_1.decorators.string({ maxLength: 150 }),
    __metadata("design:type", String)
], LoginOAuthNewRequest.prototype, "appDescription", void 0);
__decorate([
    common_1.decorators.required(),
    common_1.decorators.string({ maxLength: 100 }),
    __metadata("design:type", String)
], LoginOAuthNewRequest.prototype, "deviceName", void 0);
__decorate([
    common_1.decorators.string({ maxLength: 100 }),
    __metadata("design:type", String)
], LoginOAuthNewRequest.prototype, "ipAddress", void 0);
__decorate([
    common_1.decorators.boolean(),
    common_1.decorators.defaultAs(false),
    __metadata("design:type", Boolean)
], LoginOAuthNewRequest.prototype, "allowRefresh", void 0);
__decorate([
    common_1.decorators.array({
        items: joi.string().valid(...exports.ACCOUNT_FIELDS),
    }),
    __metadata("design:type", Array)
], LoginOAuthNewRequest.prototype, "claimFields", void 0);
exports.LoginOAuthNewRequest = LoginOAuthNewRequest;
class LoginOAuthNewResponse extends dto_base_1.ResultResponse {
    constructor() {
        super(...arguments);
        this.accountId = undefined;
        this.displayName = undefined;
        this.timezone = undefined;
        this.accessToken = undefined;
        /**
         * Gets or sets the time when `accessToken` will be expired.
         *
         * Though it can be extracted from `accessToken` itself, this property
         * saves you some CPU cycles.
         */
        this.accessTokenExpiredAt = undefined;
        this.refreshToken = undefined;
        /**
         * Gets or sets the time when `refreshToken` will be expired.
         *
         * Though it can be extracted from `refreshToken` itself, this property
         * saves you some CPU cycles.
         */
        this.refreshTokenExpiredAt = undefined;
        /**
         * Gets or sets the logged in time, in most cases this is the current time.
         */
        this.loggedInAt = undefined;
    }
}
exports.LoginOAuthNewResponse = LoginOAuthNewResponse;
class LoginOAuthRefreshRequest extends common_1.Translatable {
    constructor() {
        super(...arguments);
        /**
         * Gets the refresh token given by `OAuthNewLoginResponse`.
         */
        this.refreshToken = undefined;
        this.appName = undefined;
        this.appDescription = undefined;
        this.deviceName = undefined;
        this.ipAddress = undefined;
    }
}
__decorate([
    common_1.decorators.required(),
    common_1.decorators.string(),
    __metadata("design:type", String)
], LoginOAuthRefreshRequest.prototype, "refreshToken", void 0);
__decorate([
    common_1.decorators.required(),
    common_1.decorators.string({ maxLength: 100 }),
    __metadata("design:type", String)
], LoginOAuthRefreshRequest.prototype, "appName", void 0);
__decorate([
    common_1.decorators.string({ maxLength: 150 }),
    __metadata("design:type", String)
], LoginOAuthRefreshRequest.prototype, "appDescription", void 0);
__decorate([
    common_1.decorators.string({ maxLength: 100 }),
    __metadata("design:type", String)
], LoginOAuthRefreshRequest.prototype, "deviceName", void 0);
__decorate([
    common_1.decorators.required(),
    common_1.decorators.string({ maxLength: 100 }),
    __metadata("design:type", String)
], LoginOAuthRefreshRequest.prototype, "ipAddress", void 0);
exports.LoginOAuthRefreshRequest = LoginOAuthRefreshRequest;
class LoginOAuthRefreshResponse extends dto_base_1.ResultResponse {
    constructor() {
        super(...arguments);
        this.accountId = undefined;
        this.accessToken = undefined;
        /**
         * Gets or sets the time when `accessToken` will be expired.
         *
         * Though it can be extracted from `accessToken` itself, this property
         * saves you some CPU cycles.
         */
        this.accessTokenExpiredAt = undefined;
        /**
         * Gets or sets the refreshed time, in most cases this is the current time.
         */
        this.refreshedAt = undefined;
    }
}
exports.LoginOAuthRefreshResponse = LoginOAuthRefreshResponse;
class LogOutOAuthRequest extends common_1.Translatable {
    constructor() {
        super(...arguments);
        this.accessToken = undefined;
    }
}
__decorate([
    common_1.decorators.required(),
    common_1.decorators.string(),
    __metadata("design:type", String)
], LogOutOAuthRequest.prototype, "accessToken", void 0);
exports.LogOutOAuthRequest = LogOutOAuthRequest;
class LogOutOAuthResponse extends dto_base_1.MaybeResponse {
    constructor() {
        super(...arguments);
        /**
         * Gets or sets the logged out time, in most cases this is the current time.
         */
        this.loggedOutAt = undefined;
    }
}
exports.LogOutOAuthResponse = LogOutOAuthResponse;
// #endregion Authenticate
// #region Token
class DecodeAccessTokenRequest extends common_1.Translatable {
    constructor() {
        super(...arguments);
        this.accessToken = undefined;
    }
}
__decorate([
    common_1.decorators.required(),
    common_1.decorators.string(),
    __metadata("design:type", String)
], DecodeAccessTokenRequest.prototype, "accessToken", void 0);
exports.DecodeAccessTokenRequest = DecodeAccessTokenRequest;
class DecodeAccessTokenResponse extends dto_base_1.ResultResponse {
}
exports.DecodeAccessTokenResponse = DecodeAccessTokenResponse;
class ExtendAccessTokenRequest extends common_1.Translatable {
    constructor() {
        super(...arguments);
        this.accessToken = undefined;
        this.appName = undefined;
        this.appDescription = undefined;
        this.deviceName = undefined;
        this.ipAddress = undefined;
    }
}
__decorate([
    common_1.decorators.required(),
    common_1.decorators.string(),
    __metadata("design:type", String)
], ExtendAccessTokenRequest.prototype, "accessToken", void 0);
__decorate([
    common_1.decorators.required(),
    common_1.decorators.string({ maxLength: 100 }),
    __metadata("design:type", String)
], ExtendAccessTokenRequest.prototype, "appName", void 0);
__decorate([
    common_1.decorators.string({ maxLength: 150 }),
    __metadata("design:type", String)
], ExtendAccessTokenRequest.prototype, "appDescription", void 0);
__decorate([
    common_1.decorators.string({ maxLength: 100 }),
    __metadata("design:type", String)
], ExtendAccessTokenRequest.prototype, "deviceName", void 0);
__decorate([
    common_1.decorators.required(),
    common_1.decorators.string({ maxLength: 100 }),
    __metadata("design:type", String)
], ExtendAccessTokenRequest.prototype, "ipAddress", void 0);
exports.ExtendAccessTokenRequest = ExtendAccessTokenRequest;
class ExtendAccessTokenResponse extends dto_base_1.ResultResponse {
    constructor() {
        super(...arguments);
        this.accessToken = undefined;
        this.accessTokenExpiredAt = undefined;
        /**
         * Gets or sets the extended time, in most cases this is the current time.
         */
        this.extendedAt = undefined;
    }
}
exports.ExtendAccessTokenResponse = ExtendAccessTokenResponse;
class GetAccessTokenBlackListResponse {
    constructor(hasData = true) {
        /**
         * If `false`, other properties are unusable.
         */
        this.hasData = undefined;
        this.accessTokens = undefined;
        this.updatedAt = undefined;
        this.hasData = hasData;
    }
    static from(source) {
        const srcTokens = source['accessTokens'];
        if (Array.isArray(srcTokens) && srcTokens.length) {
            const response = new GetAccessTokenBlackListResponse(true);
            response.accessTokens = [...srcTokens];
            response.updatedAt = source['updatedAt'];
            return response;
        }
        return new GetAccessTokenBlackListResponse(false);
    }
    includes(token) {
        return Array.isArray(this.accessTokens) && this.accessTokens.includes(token);
    }
}
exports.GetAccessTokenBlackListResponse = GetAccessTokenBlackListResponse;
// #endregion Token
//# sourceMappingURL=auth.js.map