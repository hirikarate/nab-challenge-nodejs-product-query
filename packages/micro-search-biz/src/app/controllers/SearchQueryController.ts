/// <reference types="debug" />
const debug: debug.IDebugger = require('debug')('nab:ctrl:product')

import * as cm from '@micro-fleet/common'

const { inject } = cm.decorators
import { decorators as d } from '@micro-fleet/service-communication'

import { Types as T } from '../constants/Types'
import * as dto from '../contracts/dto/search'
import { ISearchQueryService } from '../contracts/interfaces/ISearchQueryService'
import { trustPayload } from '../utils/controller-util'


@d.directController(dto.MODULE_NAME)
export default class SearchQueryController {
	constructor(@inject(T.SEARCH_QUERY_SVC) private _searchSvc: ISearchQueryService) {
		debug('SearchQueryController instantiated')
	}


	@d.action(dto.Action.FILTER)
	public filter(@trustPayload() request: dto.FilterRequest): Promise<dto.SearchResponse> {
		try {
			return this._searchSvc.filter(request)
		}
		catch (err) {
			console.error(err)
			throw err
		}
	}

	@d.action(dto.Action.SEARCH_ADVANCED)
	public searchAdvanced(@trustPayload() request: dto.SearchAdvancedRequest): Promise<dto.SearchResponse> {
		try {
			return this._searchSvc.searchAdvanced(request)
		}
		catch (err) {
			console.error(err)
			throw err
		}
	}

}
