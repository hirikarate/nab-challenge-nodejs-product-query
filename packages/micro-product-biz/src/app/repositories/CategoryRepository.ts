/// <reference types="debug" />
const debug: debug.IDebugger = require('debug')('nab:repo:category')

import { decorators as cd } from '@micro-fleet/common'
import * as p from '@micro-fleet/persistence'

import { Category } from '../models/domain/Category'
import { CategoryORM } from '../models/orm/CategoryORM'


/*
 * Provides methods to manage categories.
 */
export interface ICategoryRepository extends p.IRepository<Category> {
}


export class CategoryRepository extends p.PgCrudRepositoryBase<CategoryORM, Category>
	implements ICategoryRepository {
	constructor(@cd.inject(p.Types.DB_CONNECTOR) connector: p.IDatabaseConnector) {
		super(CategoryORM, Category, connector)
		debug('CategoryRepository instantiated')
	}
}
