// import * as express from 'express'
import { decorators as d, Result } from '@micro-fleet/common'
import {
	IActionFilter, ActionFilterBase,
	Request, Response,
} from '@micro-fleet/web'

import { Types as T } from '../constants/Types'
import * as dto from '../contracts/dto/auth'
import { IAuthService } from '../contracts/interfaces/IAuthService'


export class AuthorizeFilter
	extends ActionFilterBase
	implements IActionFilter {

	@d.lazyInject(T.AUTH_SVC) private _authSvc: IAuthService

	public async execute(request: Request, response: Response, next: Function): Promise<any> {
		try {
			const token = await this._authSvc.loginOAuthNew({ displayName: 'I live forever' } as any)
			const result = await this._authorizeRequest(request)
			if (result.isFailure) {
				response.status(401).send(new UnauthorizeResponse(result.error))
				return
			}
			this.addReadonlyProp(request, 'user', result.value)
			next()
		}
		catch (err) {
			console.error(err)
			response.sendStatus(401) // 401 Unthorized
		}
	}

	private _extractToken(request: Request): string {
		const header = request.headers['authorization'] || ''
		return header.slice('Bearer '.length)
	}

	private async _authorizeRequest(request: Request): Promise<Result<dto.DecodeAccessTokenResponse>> {
		const accessToken = this._extractToken(request)
		if (!accessToken) {
			return Result.Failure('NO_ACCESS_TOKEN')
		}
		const params = dto.DecodeAccessTokenRequest.from({
			accessToken,
		})
		const result = await this._authSvc.decodeAccessToken(params)
		return result.toResult()
	}
}

class UnauthorizeResponse {
	public hasData = false

	constructor(public error: any) {
	}
}