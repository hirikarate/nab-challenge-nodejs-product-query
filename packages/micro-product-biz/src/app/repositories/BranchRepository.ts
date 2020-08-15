/// <reference types="debug" />
const debug: debug.IDebugger = require('debug')('nab:repo:branch')

import { decorators as cd } from '@micro-fleet/common'
import * as p from '@micro-fleet/persistence'

import { Branch } from '../models/domain/Branch'
import { BranchORM } from '../models/orm/BranchORM'


/*
 * Provides methods to manage branches.
 */
export interface IBranchRepository extends p.IRepository<Branch> {
}

export class BranchRepository extends p.PgCrudRepositoryBase<BranchORM, Branch> implements IBranchRepository {
	constructor(@cd.inject(p.Types.DB_CONNECTOR) connector: p.IDatabaseConnector) {
		super(BranchORM, Branch, connector)
		debug('BranchRepository instantiated')
	}
}
