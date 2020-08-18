/* eslint-disable @typescript-eslint/indent */
/// <reference types="debug" />
const debug: debug.IDebugger = require('debug')('nab:svc:statistics')

import { decorators as d } from '@micro-fleet/common'
import { Types as iT, IIdProvider } from '@micro-fleet/id-generator'
import { Types as pT, AtomicSessionFactory } from '@micro-fleet/persistence'

import { Types as T } from '../constants/Types'
import * as dto from '../contracts/dto/statistics'
import { IStatisticsService } from '../contracts/interfaces/IStatisticsService'
import { RequestLogEntry } from '../models/domain/RequestLogEntry'
import { IRequestLogRepository } from '../repositories/RequestLogRepository'
import { ManagementServiceBase } from './ManagementServiceBase'


export class StatisticsService
	extends ManagementServiceBase<RequestLogEntry>
	implements IStatisticsService {


	constructor(
		@d.inject(pT.ATOMIC_SESSION_FACTORY) sessionFactory: AtomicSessionFactory,
		@d.inject(T.REQUEST_LOG_REPO) repo: IRequestLogRepository,
		@d.inject(iT.ID_PROVIDER) private _idGen: IIdProvider,
	) {
		super(RequestLogEntry, repo, sessionFactory)
		debug('StatisticsService instantiated')
	}

	/**
	 * @see IStatisticsService.create
	 */
	public create(params: dto.CreateStatisticsRequest): Promise<dto.CreateStatisticsResponse> {
		return this.$create(
			{
				...params,
				id: this._idGen.nextBigInt(),
			},
			dto.CreateStatisticsResponse,
		)
	}
}
