import * as crypto from 'crypto'
import * as util from 'util'

import { decorators as d, Result } from '@micro-fleet/common'
import * as jwt from 'jsonwebtoken'

import {
	IJwtHelper, EncodeTokenOptions,
	DecodeTokenOptions, JwtDecoded,
} from '../contracts/interfaces/IJwtHelper'


const UNICODE_SIZE = 2
const randomBytesAsync: (size: number) => Promise<Buffer> = util.promisify(crypto.randomBytes)

export type JwtFn = {
	sign: (options: EncodeTokenOptions) => string,
	verify: (options: DecodeTokenOptions) => object,
}

export const jwtFn: JwtFn = {
	sign(options: EncodeTokenOptions): string {
		const jwtOpts: jwt.SignOptions = {
			...options,
			// Set `jwtid` to avoid generating duplicate tokens
			// when sign() function is call in same second for same payload.
			jwtid: new Date().valueOf().toString(),
			algorithm: 'RS256',
		}
		delete jwtOpts['claims']
		delete jwtOpts['key']
		delete jwtOpts['issuedAt']

		// jsonwebtoken library doesn't give any setting for "iat",
		// so I peeked at its source code and found a way.
		if (Number.isSafeInteger(options.issuedAt) && options.issuedAt > 0) {
			options.claims['iat'] = options.issuedAt
		}

		return jwt.sign(
			options.claims || {},
			options.key,
			jwtOpts,
		)
	},

	verify(options: DecodeTokenOptions): object {
		const jwtOpts = {
			...options,
			algorithms: ['RS256'],
		}
		delete jwtOpts.key
		delete jwtOpts.token
		return jwt.verify(
			options.token,
			options.key,
			jwtOpts as any,
		) as object
	},
}


@d.injectable()
export class RsaJwtHelper implements IJwtHelper {

	/**
	 * @see IJwtHelper.createToken
	 */
	public encodeToken(options: EncodeTokenOptions): Promise<Result<string, any>> {
		try {
			return Promise.resolve(Result.Ok(jwtFn.sign(options)))
		}
		catch (e) {
			return Promise.resolve(Result.Failure(e))
		}
	}

	/**
	 * @see IJwtHelper.decodeToken
	 */
	public decodeToken<TClaims>(options: DecodeTokenOptions): Promise<Result<JwtDecoded<TClaims>, any>> {
		try {
			return Promise.resolve(Result.Ok(new JwtDecoded(jwtFn.verify(options))))
		}
		catch (e) {
			return Promise.resolve(Result.Failure(e))
		}
	}

	/**
	 * @see IJwtHelper.randomToken
	 */
	public randomToken(expectedLength: number): Promise<string> {
		return randomBytesAsync(Math.floor(expectedLength / UNICODE_SIZE))
			.then(buf => buf.toString('hex').slice(0, expectedLength))
	}
}
