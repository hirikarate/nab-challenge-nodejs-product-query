import * as moment from 'moment'
import { Result } from '@micro-fleet/common'


export type EncodeTokenOptions = {
	key: string,
	claims?: object,
	issuer?: string,
	subject?: string,
	audience?: string,

	/**
	 * The timestamp (in number of seconds) when the token is created.
	 * This property is IMPORTANT because it's used to calculate "expiration" and "notBefore",
	 * so it should be set manually when your backend code use different timezone
	 * with your host operating system.
	 *
	 * Default value is calculated as `Math.floor(Date.now() / 1000)`, which is the current
	 * timestamp of host operating system.
	 */
	issuedAt?: number,

	/**
	 * The time span (since "issuedAt") when the token will expire.
	 *
	 * Must be expressed as number of seconds or a string describing a time span
	 * @see https://github.com/zeit/ms.js
	 * @example 60, '2 days', '10h', '7d'
	 */
	expiresIn?: number | string,

	/**
	 * The time span (since "issuedAt") when the token will have effect.
	 *
	 * Must be expressed as number of seconds or a string describing a time span
	 * @see https://github.com/zeit/ms.js
	 * @example 60, '2 days', '10h', '7d'
	 */
	notBefore?: number | string,
}

export type DecodeTokenOptions = {
	key: string,
	token: string,
	issuer?: string,
	subject?: string,
	audience?: string | string[],
	ignoreExpiration?: boolean,
	ignoreNotBefore?: boolean,
}


export class JwtDecoded<TClaims = any> {
	public readonly claims: TClaims

	/**
	 * The timestamp (in UTC seconds) when this token was generated.
	 */
	public readonly createdTimestamp: number

	/**
	 * The timestamp (in UTC seconds) when this token is expired.
	 */
	public readonly expiredTimestamp?: number

	/**
	 * The timestamp (in UTC seconds) when this token begins taking effect.
	 */
	public readonly notBeforeTimestamp: number

	public get audience(): string {
		return this.claims['aud']
	}

	public get issuer(): string {
		return this.claims['iss']
	}

	public get createdMoment(): moment.Moment {
		return moment.unix(this.createdTimestamp).utc()
	}

	public get expiredMoment(): moment.Moment {
		return this.expiredTimestamp ? moment.unix(this.expiredTimestamp).utc() : null
	}

	public get notBeforeMoment(): moment.Moment {
		return moment.unix(this.notBeforeTimestamp).utc()
	}

	public get isExpired(): boolean {
		return (this.claims['exp'] != null)
			? (moment.utc().unix() >= this.claims['exp']) // Converted to seconds
			: false // Token without 'exp' never expires
	}

	public get subject(): string {
		return this.claims['sub']
	}

	constructor(rawDecoded: any) {
		const cm = this.claims = Object.freeze(rawDecoded)
		this.createdTimestamp = cm['iat']
		this.expiredTimestamp = cm['exp']
		this.notBeforeTimestamp = cm['nbf'] || this.createdTimestamp
	}

}

export interface IJwtHelper {
	/**
	 * Creates JWT token
	 */
	encodeToken: (options: EncodeTokenOptions) => Promise<Result<string, any>>
	/**
	 * Attempts to decode JWT token
	 */
	decodeToken: <TClaims>(options: DecodeTokenOptions) => Promise<Result<JwtDecoded<TClaims>, any>>

	/**
	 * Generates a token with random charaters.
	 * @param {number} expectedLength Desired number of characters in output,
	 * 	but not guaranteed.
	 */
	randomToken: (expectedLength: number) => Promise<string>
}
