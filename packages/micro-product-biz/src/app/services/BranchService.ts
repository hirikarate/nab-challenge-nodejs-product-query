/// <reference types="debug" />
const debug: debug.IDebugger = require('debug')('nab:svc:branch')

import { Maybe, decorators as d } from '@micro-fleet/common'
import { Types as iT, IIdProvider } from '@micro-fleet/id-generator'
import { Types as pT, AtomicSessionFactory } from '@micro-fleet/persistence'

import { Types as T } from '../constants/Types'
import * as dto from '../contracts/dto/branch'
import { IBranchService } from '../contracts/interfaces/IBranchService'
import { Branch } from '../models/domain/Branch'
import { IBranchRepository } from '../repositories/BranchRepository'
import { ManagementServiceBase } from './ManagementServiceBase'


export class BranchService extends ManagementServiceBase<Branch> implements IBranchService {

	constructor(
	@d.inject(pT.ATOMIC_SESSION_FACTORY) sessionFactory: AtomicSessionFactory,
		@d.inject(T.BRANCH_REPO) repo: IBranchRepository,
		@d.inject(iT.ID_PROVIDER) private _idGen: IIdProvider,
	) {
		super(Branch, repo, sessionFactory)
		debug('BranchService instantiated')
	}

	// #region Create

	/**
	 * @see IBranchService.create
	 */
	public create(params: dto.CreateBranchRequest): Promise<dto.CreateBranchResponse> {
		return this.$create(
			{
				...params,
				id: this._idGen.nextBigInt().toString(),
			},
			dto.CreateBranchResponse,
		)
	}

	/**
	 * @override
	 */
	protected async $checkCreateViolation(params: dto.CreateBranchRequest): Promise<Maybe<string>> {
		if (await this.$repo.exists({ name: params.name })) {
			return Maybe.Just('CATEGORY_NAME_ALREADY_EXISTS')
		}
		return Maybe.Nothing()
	}

	// #endregion Create


	/**
	 * @see IBranchService.edit
	 */
	public edit(params: dto.EditBranchRequest): Promise<dto.EditBranchResponse> {
		return this.$edit(params, dto.EditBranchResponse)
	}

	/**
	 * @see IBranchService.hardDeleteSingle
	 */
	public hardDeleteSingle(params: dto.DeleteBranchRequest): Promise<dto.DeleteBranchResponse> {
		return this.$hardDeleteSingle(params, dto.DeleteBranchResponse)
	}

	/**
	 * @see IBranchService.hardDeleteMany
	 */
	public hardDeleteMany(params: dto.DeleteBranchRequest): Promise<dto.DeleteBranchResponse> {
		return this.$hardDeleteMany(params, dto.DeleteBranchResponse)
	}

	/**
	 * @see IBranchService.getById
	 */
	public getById(params: dto.GetBranchByIdRequest): Promise<dto.GetSingleBranchResponse> {
		return this.$getById(params, dto.GetSingleBranchResponse)
	}

	/**
	 * @see IBranchService.getList
	 */
	public getList(params: dto.GetBranchListRequest): Promise<dto.GetBranchListResponse> {
		debug('BranchService.getList')
		return this.$getList(params, dto.GetBranchListResponse)
	}

}
