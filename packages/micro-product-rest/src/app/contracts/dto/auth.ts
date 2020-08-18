import * as joi from '@hapi/joi'

import { Translatable, decorators as d } from '@micro-fleet/common'


import { AccountStatus } from '../../constants/account'
import { ResultResponse, MaybeResponse } from './dto-base'



export const ACCOUNT_FIELDS = [
	'id', 'username', 'timezone', 'createdAt', 'updatedAt',
	'displayName', 'firstName', 'lastName', 'email',
]


// #region Authenticate

export class CheckCredentialsRequest extends Translatable {
	@d.required()
	@d.string({ maxLength: 100 })
	public readonly username: string = undefined

	@d.required()
	@d.string({ maxLength: 500 })
	public readonly password: string = undefined
}


export class CheckCredentialsResponse extends ResultResponse {
	public accountId: string = undefined
	public displayName: string = undefined
	public timezone: string = undefined
	public accountStatus: AccountStatus = undefined

	/**
	 * Gets or sets last logged in date time
	 */
	public lastLoggedInAt: string = undefined

	/**
	 * Gets or sets last logged in IP address
	 */
	public lastLoggedInIP: string = undefined

	/**
	 * Gets or sets last logged in location (estimated based on IP)
	 */
	public lastLoggedInFrom: string = undefined
}


export class LoginOAuthNewRequest extends Translatable {

	@d.required()
	@d.string({ maxLength: 100 })
	public readonly username: string = undefined

	@d.required()
	@d.string({ maxLength: 500 })
	public readonly password: string = undefined

	@d.required()
	@d.string({ maxLength: 100 })
	public readonly appName: string = undefined

	@d.string({ maxLength: 150 })
	public readonly appDescription?: string = undefined

	@d.required()
	@d.string({ maxLength: 100 })
	public readonly deviceName: string = undefined

	@d.string({ maxLength: 100 })
	public readonly ipAddress?: string = undefined

	/**
	 * Indicates whether refresh token should be generated or not.
	 */
	@d.boolean()
	@d.defaultAs(false)
	public readonly allowRefresh?: boolean = undefined

	/**
	 * Gets account fields to include in the returned access token.
	 */
	@d.array({
		items: joi.string().valid(...ACCOUNT_FIELDS),
	})
	public readonly claimFields?: string[] = undefined
}


export class LoginOAuthNewResponse extends ResultResponse {
	public accountId: string = undefined
	public displayName: string = undefined
	public timezone: string = undefined
	public accessToken: string = undefined

	/**
	 * Gets or sets the time when `accessToken` will be expired.
	 *
	 * Though it can be extracted from `accessToken` itself, this property
	 * saves you some CPU cycles.
	 */
	public accessTokenExpiredAt: string = undefined

	public refreshToken?: string = undefined

	/**
	 * Gets or sets the time when `refreshToken` will be expired.
	 *
	 * Though it can be extracted from `refreshToken` itself, this property
	 * saves you some CPU cycles.
	 */
	public refreshTokenExpiredAt?: string = undefined

	/**
	 * Gets or sets the logged in time, in most cases this is the current time.
	 */
	public loggedInAt: string = undefined

}

export class LoginOAuthRefreshRequest extends Translatable {
	/**
	 * Gets the refresh token given by `OAuthNewLoginResponse`.
	 */
	@d.required()
	@d.string()
	public readonly refreshToken: string = undefined

	@d.required()
	@d.string({ maxLength: 100 })
	public readonly appName: string = undefined

	@d.string({ maxLength: 150 })
	public readonly appDescription?: string = undefined

	@d.string({ maxLength: 100 })
	public readonly deviceName?: string = undefined

	@d.required()
	@d.string({ maxLength: 100 })
	public readonly ipAddress: string = undefined
}


export class LoginOAuthRefreshResponse extends ResultResponse {
	public accountId: string = undefined
	public accessToken: string = undefined

	/**
	 * Gets or sets the time when `accessToken` will be expired.
	 *
	 * Though it can be extracted from `accessToken` itself, this property
	 * saves you some CPU cycles.
	 */
	public accessTokenExpiredAt: string = undefined

	/**
	 * Gets or sets the refreshed time, in most cases this is the current time.
	 */
	public refreshedAt: string = undefined

}


export class LogOutOAuthRequest extends Translatable {
	@d.required()
	@d.string()
	public readonly accessToken: string = undefined
}


export class LogOutOAuthResponse extends MaybeResponse {
	/**
	 * Gets or sets the logged out time, in most cases this is the current time.
	 */
	public loggedOutAt: string = undefined
}

// #endregion Authenticate


// #region Token

export class DecodeAccessTokenRequest extends Translatable {
	@d.required()
	@d.string()
	public readonly accessToken: string = undefined
}

export class DecodeAccessTokenResponse extends ResultResponse {
	public id?: string
	public username?: string
	public status?: string
	public statusExpiredAt?: string
	public timezone?: string
	public createdAt?: string
	public updatedAt?: string
	public displayName?: string
	public firstName?: string
	public lastName?: string
	public email?: string

}

export class ExtendAccessTokenRequest extends Translatable {
	@d.required()
	@d.string()
	public readonly accessToken: string = undefined

	@d.required()
	@d.string({ maxLength: 100 })
	public readonly appName: string = undefined

	@d.string({ maxLength: 150 })
	public readonly appDescription?: string = undefined

	@d.string({ maxLength: 100 })
	public readonly deviceName?: string = undefined

	@d.required()
	@d.string({ maxLength: 100 })
	public readonly ipAddress: string = undefined
}


export class ExtendAccessTokenResponse extends ResultResponse {
	public accessToken: string = undefined
	public accessTokenExpiredAt: string = undefined

	/**
	 * Gets or sets the extended time, in most cases this is the current time.
	 */
	public extendedAt: string = undefined
}


export class GetAccessTokenBlackListResponse {
	/**
	 * If `false`, other properties are unusable.
	 */
	public hasData: boolean = undefined
	public accessTokens: string[] = undefined
	public updatedAt: string = undefined

	public static from(source: object): GetAccessTokenBlackListResponse {
		const srcTokens = source['accessTokens']
		if (Array.isArray(srcTokens) && srcTokens.length) {
			const response = new GetAccessTokenBlackListResponse(true)
			response.accessTokens = [...srcTokens]
			response.updatedAt = source['updatedAt']
			return response
		}
		return new GetAccessTokenBlackListResponse(false)
	}

	constructor(hasData: boolean = true) {
		this.hasData = hasData
	}

	public includes(token: string): boolean {
		return Array.isArray(this.accessTokens) && this.accessTokens.includes(token)
	}
}

// #endregion Token

