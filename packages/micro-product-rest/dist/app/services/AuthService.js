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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const fs = require("fs");
const cache_1 = require("@micro-fleet/cache");
const common_1 = require("@micro-fleet/common");
const AuthSettingKeys_1 = require("../constants/AuthSettingKeys");
const Types_1 = require("../constants/Types");
const dto = require("../contracts/dto/auth");
const date_utils_1 = require("../utils/date-utils");
const timespan = require('jsonwebtoken/lib/timespan');
const SIGN_CACHE_KEY = 'AuthService.signKey';
const VERIFY_CACHE_KEY = 'AuthService.verifyKey';
/**
 * Calculates expiration time using jsonwebtoken function
 * so that we don't need to decode the generated token just to get the exp time.
 *
 * @param {string|number} duration Duration description or number of seconds
 */
function calcExp(duration) {
    const jwtExpTimestamp = timespan(duration, date_utils_1.currentUnixTimestamp());
    return date_utils_1.momentifyUnix(jwtExpTimestamp);
}
/**
 * A simplified implementation of `IAuthService` for demo purpose.
 */
let AuthService = class AuthService {
    constructor(_config, _jwtHelper) {
        this._config = _config;
        this._jwtHelper = _jwtHelper;
    }
    /**
     * @see IAuthService.checkCredentials
     */
    checkCredentials(_params) {
        throw new common_1.NotImplementedException('Stripped for demo purpose');
    }
    /**
     * @see IAuthService.decodeAccessToken
     */
    async decodeAccessToken(params) {
        const blacklist = await this.getAccessTokenBlackList();
        if (blacklist.includes(params.accessToken)) {
            return new dto.DecodeAccessTokenResponse(false, 'TOKEN_IS_BLACKLISTED');
        }
        const key = await this._getVerifyKey();
        const rsClaims = await this._jwtHelper.decodeToken({
            key,
            token: params.accessToken,
        });
        return rsClaims.isOk
            ? dto.DecodeAccessTokenResponse.from(rsClaims.value)
            : new dto.DecodeAccessTokenResponse(false, rsClaims.error);
    }
    /**
     * @see IAuthService.extendAccessToken
     */
    extendAccessToken(_params) {
        throw new common_1.NotImplementedException('Stripped for demo purpose');
    }
    /**
     * @see IAuthService.getAccessTokenBlackList
     */
    getAccessTokenBlackList() {
        /*
         * Quick implementation for demo purpose
         */
        /* eslint-disable max-len */
        return Promise.resolve(dto.GetAccessTokenBlackListResponse.from({
            accessTokens: [
                'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJkaXNwbGF5TmFtZSI6Ik5BQiBDaGFsbGVuZ2UiLCJpYXQiOjE1OTc3ODU1MTQsImV4cCI6MTYwMDM3NzUxNCwianRpIjoiMTU5Nzc4NTUxNDQ2NyJ9.fI-eW_1BmOylNbvx2rlbFrkvkKHOYaqY-w02P9RkdgfhaE299kuqfndEK2_3o452IBJdKYpDWIo41SlsaTLq8Q',
            ],
        }));
        /* eslint-enable max-len */
    }
    /**
     * @see IAuthService.loginOAuthNew
     */
    async loginOAuthNew(_params) {
        /*
         * Quick implementation for demo purpose
         */
        const rsAccess = await this._generateAccessToken({
            displayName: 'NAB Challenge',
        });
        if (rsAccess.isFailure) {
            throw new common_1.MinorException(rsAccess.error);
        }
        const access = rsAccess.value;
        return dto.LoginOAuthNewResponse.from({
            displayName: 'NAB Challenge',
            accessToken: access.token,
            accessTokenExpiredAt: access.expAt,
            refreshToken: null,
            refreshTokenExpiredAt: null,
            timezone: null,
            loggedInAt: null,
        });
    }
    async _generateAccessToken(claims) {
        const privateKey = await this._getSignKey();
        const expirationSpan = this._getExpireConfig(AuthSettingKeys_1.Auth.AUTH_EXPIRE_ACCESS, 'access token expiration');
        const expAt = calcExp(expirationSpan).format();
        const rsAccessToken = await this._jwtHelper.encodeToken({
            key: privateKey,
            claims,
            // Set issue time as current UTC timestamp,
            // so that `expiresIn` is calculated base on this.
            issuedAt: date_utils_1.currentUnixTimestamp(),
            expiresIn: expirationSpan,
        });
        if (rsAccessToken.isFailure) {
            return rsAccessToken;
        }
        return common_1.Result.Ok({
            token: rsAccessToken.value,
            expAt,
        });
    }
    _getExpireConfig(configKey, nameInError) {
        const maybe = this._config.get(configKey);
        if (maybe.isNothing) {
            throw new common_1.MinorException(`No configuration is specified for ${nameInError}`);
        }
        return maybe.value;
    }
    /**
     * @see IAuthService.loginOAuthRefresh
     */
    loginOAuthRefresh(_params) {
        throw new common_1.NotImplementedException('Stripped for demo purpose');
    }
    /**
     * @see IAuthService.logOutOAuth
     */
    logOutOAuth(_params) {
        throw new common_1.NotImplementedException('Stripped for demo purpose');
    }
    async _getSignKey() {
        return this._getKey(AuthSettingKeys_1.Auth.AUTH_KEY_SIGN, AuthSettingKeys_1.Auth.AUTH_KEY_SIGN_FILE, 'No key or key file is specified for JWT signing');
    }
    async _getVerifyKey() {
        return this._getKey(AuthSettingKeys_1.Auth.AUTH_KEY_VERIFY, AuthSettingKeys_1.Auth.AUTH_KEY_VERIFY_FILE, 'No key or key file is specified for JWT verifying');
    }
    async _getKey(key, keyFile, errorMessage) {
        const mbFile = this._config.get(keyFile);
        if (mbFile.isJust) {
            const keyContent = await fs.promises.readFile(mbFile.value, 'utf-8');
            if (!keyContent) {
                throw new common_1.MinorException(errorMessage);
            }
            return keyContent;
        }
        const mbKey = this._config.get(key);
        if (mbKey.isJust) {
            return mbKey.value;
        }
        throw new common_1.MinorException(errorMessage);
    }
};
__decorate([
    cache_1.cacheable({
        cacheKey: SIGN_CACHE_KEY,
        cacheLevel: cache_1.CacheLevel.LOCAL,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthService.prototype, "_getSignKey", null);
__decorate([
    cache_1.cacheable({
        cacheKey: VERIFY_CACHE_KEY,
        cacheLevel: cache_1.CacheLevel.LOCAL,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthService.prototype, "_getVerifyKey", null);
AuthService = __decorate([
    common_1.decorators.injectable(),
    __param(0, common_1.decorators.inject(common_1.Types.CONFIG_PROVIDER)),
    __param(1, common_1.decorators.inject(Types_1.Types.JWT_HELPER)),
    __metadata("design:paramtypes", [Object, Object])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=AuthService.js.map