"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RsaJwtHelper = exports.jwtFn = void 0;
const crypto = require("crypto");
const util = require("util");
const common_1 = require("@micro-fleet/common");
const jwt = require("jsonwebtoken");
const IJwtHelper_1 = require("../contracts/interfaces/IJwtHelper");
const UNICODE_SIZE = 2;
const randomBytesAsync = util.promisify(crypto.randomBytes);
exports.jwtFn = {
    sign(options) {
        const jwtOpts = {
            ...options,
            // Set `jwtid` to avoid generating duplicate tokens
            // when sign() function is call in same second for same payload.
            jwtid: new Date().valueOf().toString(),
            algorithm: 'RS256',
        };
        delete jwtOpts['claims'];
        delete jwtOpts['key'];
        delete jwtOpts['issuedAt'];
        // jsonwebtoken library doesn't give any setting for "iat",
        // so I peeked at its source code and found a way.
        if (Number.isSafeInteger(options.issuedAt) && options.issuedAt > 0) {
            options.claims['iat'] = options.issuedAt;
        }
        return jwt.sign(options.claims || {}, options.key, jwtOpts);
    },
    verify(options) {
        const jwtOpts = {
            ...options,
            algorithms: ['RS256'],
        };
        delete jwtOpts.key;
        delete jwtOpts.token;
        return jwt.verify(options.token, options.key, jwtOpts);
    },
};
let RsaJwtHelper = class RsaJwtHelper {
    /**
     * @see IJwtHelper.createToken
     */
    encodeToken(options) {
        try {
            return Promise.resolve(common_1.Result.Ok(exports.jwtFn.sign(options)));
        }
        catch (e) {
            return Promise.resolve(common_1.Result.Failure(e));
        }
    }
    /**
     * @see IJwtHelper.decodeToken
     */
    decodeToken(options) {
        try {
            return Promise.resolve(common_1.Result.Ok(new IJwtHelper_1.JwtDecoded(exports.jwtFn.verify(options))));
        }
        catch (e) {
            return Promise.resolve(common_1.Result.Failure(e));
        }
    }
    /**
     * @see IJwtHelper.randomToken
     */
    randomToken(expectedLength) {
        return randomBytesAsync(Math.floor(expectedLength / UNICODE_SIZE))
            .then(buf => buf.toString('hex').slice(0, expectedLength));
    }
};
RsaJwtHelper = __decorate([
    common_1.decorators.injectable()
], RsaJwtHelper);
exports.RsaJwtHelper = RsaJwtHelper;
//# sourceMappingURL=RsaJwtHelper.js.map