import * as fs from 'fs'

import * as moment from 'moment'
import { CacheLevel, cacheable } from '@micro-fleet/cache'
import {
	decorators as d, Types as cmT, Result, Maybe,
	IConfigurationProvider, MinorException, NotImplementedException,
} from '@micro-fleet/common'

import { Auth as A } from '../constants/AuthSettingKeys'
import { Types as T } from '../constants/Types'
import * as dto from '../contracts/dto/auth'
import { IAuthService } from '../contracts/interfaces/IAuthService'
import { IJwtHelper } from '../contracts/interfaces/IJwtHelper'
import { momentifyUnix, currentUnixTimestamp } from '../utils/date-utils'

const timespan = require('jsonwebtoken/lib/timespan')

const SIGN_CACHE_KEY = 'AuthService.signKey'
const VERIFY_CACHE_KEY = 'AuthService.verifyKey'


/**
 * Calculates expiration time using jsonwebtoken function
 * so that we don't need to decode the generated token just to get the exp time.
 *
 * @param {string|number} duration Duration description or number of seconds
 */
function calcExp(duration: string|number): moment.Moment {
	const jwtExpTimestamp = timespan(duration, currentUnixTimestamp())
	return momentifyUnix(jwtExpTimestamp)
}

/**
 * A simplified implementation of `IAuthService` for demo purpose.
 */
@d.injectable()
export class AuthService implements IAuthService {

	constructor(
		@d.inject(cmT.CONFIG_PROVIDER) private _config: IConfigurationProvider,
		@d.inject(T.JWT_HELPER) private _jwtHelper: IJwtHelper,
	) {
	}

	/**
	 * @see IAuthService.checkCredentials
	 */
	public checkCredentials(_params: dto.CheckCredentialsRequest): Promise<dto.CheckCredentialsResponse> {
		throw new NotImplementedException('Stripped for demo purpose')
	}

	/**
	 * @see IAuthService.decodeAccessToken
	 */
	public async decodeAccessToken(params: dto.DecodeAccessTokenRequest): Promise<dto.DecodeAccessTokenResponse> {
		const blacklist = await this.getAccessTokenBlackList()
		if (blacklist.includes(params.accessToken)) {
			return new dto.DecodeAccessTokenResponse(false, 'TOKEN_IS_BLACKLISTED')
		}

		const key = await this._getVerifyKey()
		const rsClaims = await this._jwtHelper.decodeToken({
			key,
			token: params.accessToken,
		})

		return rsClaims.isOk
			? dto.DecodeAccessTokenResponse.from(rsClaims.value)
			: new dto.DecodeAccessTokenResponse(false, rsClaims.error)
	}

	/**
	 * @see IAuthService.extendAccessToken
	 */
	public extendAccessToken(_params: dto.ExtendAccessTokenRequest): Promise<dto.ExtendAccessTokenResponse> {
		throw new NotImplementedException('Stripped for demo purpose')
	}

	/**
	 * @see IAuthService.getAccessTokenBlackList
	 */
	public getAccessTokenBlackList(): Promise<dto.GetAccessTokenBlackListResponse> {
		/*
		 * Quick implementation for demo purpose
		 */

		/* eslint-disable max-len */
		return Promise.resolve(dto.GetAccessTokenBlackListResponse.from({
			accessTokens: [
				'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJkaXNwbGF5TmFtZSI6Ik5BQiBDaGFsbGVuZ2UiLCJpYXQiOjE1OTc3ODU1MTQsImV4cCI6MTYwMDM3NzUxNCwianRpIjoiMTU5Nzc4NTUxNDQ2NyJ9.fI-eW_1BmOylNbvx2rlbFrkvkKHOYaqY-w02P9RkdgfhaE299kuqfndEK2_3o452IBJdKYpDWIo41SlsaTLq8Q', // Expire: '2020-09-17T21:18:34Z'
				// 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJkaXNwbGF5TmFtZSI6Ik5BQiBDaGFsbGVuZ2UiLCJpYXQiOjE1OTc3ODU2MTIsImV4cCI6MTYwMDM3NzYxMiwianRpIjoiMTU5Nzc4NTYxMjY4NSJ9.DKVTLrhoQBz3H-BkJNM7Q3YMPxIY-CwRyusA2HzHmAcpmQi5l9RRR-rpymsUQniz-NH161G8TGGkempEvGBRHw', // Expire: '2020-09-17T21:20:12Z'
				// 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJkaXNwbGF5TmFtZSI6Ik5BQiBDaGFsbGVuZ2UiLCJpYXQiOjE1OTc3ODU2NjMsImV4cCI6MTU5Nzc4NTY5MywianRpIjoiMTU5Nzc4NTY2MzE3NyJ9.hRPjOeQtMBRZGjjEnbeeIPpeRSRu7X7yxPLxcbG5k-J0MzliyySlU0RwkdiaJq863kITHAIvHzDVDr_n6kD6ow', // Expire: '2020-08-18T21:21:33Z'
			],
		}))
		/* eslint-enable max-len */
	}

	/**
	 * @see IAuthService.loginOAuthNew
	 */
	public async loginOAuthNew(_params: dto.LoginOAuthNewRequest): Promise<dto.LoginOAuthNewResponse> {
		/*
		 * Quick implementation for demo purpose
		 */

		const rsAccess = await this._generateAccessToken({
			displayName: 'NAB Challenge',
		} as any)
		if (rsAccess.isFailure) {
			throw new MinorException(rsAccess.error)
		}

		const access = rsAccess.value
		return dto.LoginOAuthNewResponse.from({
			displayName: 'NAB Challenge',
			accessToken: access.token,
			accessTokenExpiredAt: access.expAt,
			refreshToken: null,
			refreshTokenExpiredAt: null,
			timezone: null,
			loggedInAt: null,
		})
	}

	private async _generateAccessToken(claims: object): Promise<Result<{token: string, expAt: string}>> {
		const privateKey = await this._getSignKey()
		const expirationSpan = this._getExpireConfig(A.AUTH_EXPIRE_ACCESS, 'access token expiration')
		const expAt = calcExp(expirationSpan).format()
		const rsAccessToken = await this._jwtHelper.encodeToken({
			key: privateKey,
			claims,
			// Set issue time as current UTC timestamp,
			// so that `expiresIn` is calculated base on this.
			issuedAt: currentUnixTimestamp(),
			expiresIn: expirationSpan,
		})
		if (rsAccessToken.isFailure) { return rsAccessToken as Result<any> }

		return Result.Ok({
			token: rsAccessToken.value,
			expAt,
		})
	}

	private _getExpireConfig(configKey: string, nameInError: string): string {
		const maybe = this._config.get(configKey)
		if (maybe.isNothing) {
			throw new MinorException(`No configuration is specified for ${nameInError}`)
		}
		return maybe.value
	}

	/**
	 * @see IAuthService.loginOAuthRefresh
	 */
	public loginOAuthRefresh(_params: dto.LoginOAuthRefreshRequest): Promise<dto.LoginOAuthRefreshResponse> {
		throw new NotImplementedException('Stripped for demo purpose')
	}

	/**
	 * @see IAuthService.logOutOAuth
	 */
	public logOutOAuth(_params: dto.LogOutOAuthRequest): Promise<dto.LogOutOAuthResponse> {
		throw new NotImplementedException('Stripped for demo purpose')
	}


	@cacheable({
		cacheKey: SIGN_CACHE_KEY,
		cacheLevel: CacheLevel.LOCAL,
	})
	private async _getSignKey(): Promise<string> {
		return this._getKey(
			A.AUTH_KEY_SIGN,
			A.AUTH_KEY_SIGN_FILE,
			'No key or key file is specified for JWT signing',
		)
	}

	@cacheable({
		cacheKey: VERIFY_CACHE_KEY,
		cacheLevel: CacheLevel.LOCAL,
	})
	private async _getVerifyKey(): Promise<string> {
		return this._getKey(
			A.AUTH_KEY_VERIFY,
			A.AUTH_KEY_VERIFY_FILE,
			'No key or key file is specified for JWT verifying',
		)
	}

	private async _getKey(key: string, keyFile: string, errorMessage: string): Promise<string> {
		const mbFile = this._config.get(keyFile) as Maybe<string>
		if (mbFile.isJust) {
			const keyContent = await fs.promises.readFile(mbFile.value, 'utf-8')
			if (!keyContent) {
				throw new MinorException(errorMessage)
			}
			return keyContent
		}

		const mbKey = this._config.get(key) as Maybe<string>
		if (mbKey.isJust) {
			return mbKey.value
		}
		throw new MinorException(errorMessage)
	}

}
