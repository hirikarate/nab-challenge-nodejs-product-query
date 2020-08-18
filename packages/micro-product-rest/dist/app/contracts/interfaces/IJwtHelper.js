"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtDecoded = void 0;
const moment = require("moment");
class JwtDecoded {
    constructor(rawDecoded) {
        const cm = this.claims = Object.freeze(rawDecoded);
        this.createdTimestamp = cm['iat'];
        this.expiredTimestamp = cm['exp'];
        this.notBeforeTimestamp = cm['nbf'] || this.createdTimestamp;
    }
    get audience() {
        return this.claims['aud'];
    }
    get issuer() {
        return this.claims['iss'];
    }
    get createdMoment() {
        return moment.unix(this.createdTimestamp).utc();
    }
    get expiredMoment() {
        return this.expiredTimestamp ? moment.unix(this.expiredTimestamp).utc() : null;
    }
    get notBeforeMoment() {
        return moment.unix(this.notBeforeTimestamp).utc();
    }
    get isExpired() {
        return (this.claims['exp'] != null)
            ? (moment.utc().unix() >= this.claims['exp']) // Converted to seconds
            : false; // Token without 'exp' never expires
    }
    get subject() {
        return this.claims['sub'];
    }
}
exports.JwtDecoded = JwtDecoded;
//# sourceMappingURL=IJwtHelper.js.map