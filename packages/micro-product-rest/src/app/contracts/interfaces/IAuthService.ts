import * as dto from '../dto/auth'

/**
 * Provides methods to authenticate accounts and manipulate OAuth tokens.
 */
export interface IAuthService {
	/**
	 * Authenticates given credentials.
	 */
	checkCredentials: (request: dto.CheckCredentialsRequest) => Promise<dto.CheckCredentialsResponse>

	/**
	 * Verifies access token signature and returns claims.
	 */
	decodeAccessToken: (request: dto.DecodeAccessTokenRequest) => Promise<dto.DecodeAccessTokenResponse>

	/**
	 * Creates new access token with same expiration duration,
	 * and blacklist specified access token.
	 */
	extendAccessToken: (request: dto.ExtendAccessTokenRequest) => Promise<dto.ExtendAccessTokenResponse>

	/**
	 * Gets black-listed access tokens.
	 */
	getAccessTokenBlackList: () => Promise<dto.GetAccessTokenBlackListResponse>

	/**
	 * Authenticates given credentials then generates OAuth token(s).
	 */
	loginOAuthNew: (request: dto.LoginOAuthNewRequest) => Promise<dto.LoginOAuthNewResponse>

	/**
	 * Generates OAuth access token from given refresh token.
	 */
	loginOAuthRefresh: (request: dto.LoginOAuthRefreshRequest) => Promise<dto.LoginOAuthRefreshResponse>

	/**
	 * Revokes both access and refresh tokens even when they are not expired,
	 * then blacklists them to prevent reuse.
	 */
	logOutOAuth: (request: dto.LogOutOAuthRequest) => Promise<dto.LogOutOAuthResponse>
}
