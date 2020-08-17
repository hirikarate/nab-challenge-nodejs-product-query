/// <reference types="debug" />
const debug: debug.IDebugger = require('debug')('nab:repo:requestLog')

import { decorators as cd } from '@micro-fleet/common'
import * as p from '@micro-fleet/persistence'

import { RequestLogEntry } from '../models/domain/RequestLogEntry'
import { RequestLogEntryORM } from '../models/orm/RequestLogEntryORM'


/*
 * Provides methods to manage log entries.
 */
export interface IRequestLogRepository extends p.IRepository<RequestLogEntry> {
}

export class RequestLogRepository
	extends p.PgCrudRepositoryBase<RequestLogEntryORM, RequestLogEntry>
	implements IRequestLogRepository {

	constructor(@cd.inject(p.Types.DB_CONNECTOR) connector: p.IDatabaseConnector) {
		super(RequestLogEntryORM, RequestLogEntry, connector)
		debug('StatisticsRepository instantiated')
	}
}
