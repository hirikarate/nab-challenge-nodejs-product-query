import {
	Maybe, Result, PagedData, ITranslatable, Translatable, decorators as d,
} from '@micro-fleet/common'
import { SortType } from '../constants-shared'

export abstract class GetListRequestBase extends Translatable {
	@d.number({ min: 1, max: Number.MAX_SAFE_INTEGER })
	@d.defaultAs(1)
	public pageIndex: number = undefined

	@d.number({ min: 3, max: 100 })
	@d.defaultAs(10)
	public pageSize: number = undefined

	@d.string({ maxLength: 50 })
	public sortBy: string = undefined

	@d.string()
	@d.valid(SortType.ASC, SortType.DESC)
	public sortType: string = undefined
	// Do not use "SortType" in @micro-fleet/persistence because
	// this file is copy to REST service which doesn't depends on @micro-fleet/persistence.
}

export interface IListResponseConstructor {
	new (items?: object[], total?: number): any
	from: (source: object) => any
}

/**
 * Base class for DTOs that contain list of data.
 */
export abstract class DTOListBase<TL> {
	public readonly items: TL[] = undefined
	public readonly total: number = undefined

	public static from<TF extends DTOListBase<any>>(this: new (...args: any[]) => TF, source: object): TF {
		// In this case, "this" refers to the derived class, whose constructor should only accept 2 parameters.
		return new this(source['items'], source['total'])
	}

	public constructor(ItemClass: ITranslatable<TL>, items: object[] = [], total?: number) {
		this.items = ItemClass.fromMany(items)
		this.total = total != null ? total : this.items.length
	}

	public toPagedData(): PagedData<TL> {
		return new PagedData(this.items, this.total)
	}
}

export type MaybeResponseConstructor = (new (hasData?: boolean) => MaybeResponse) & ITranslatable

/**
 * Represents a response that may or may not have useable data.
 */
export abstract class MaybeResponse extends Translatable {
	/**
	 * If `false`, other properties are unusable.
	 */
	public hasData: boolean = undefined

	constructor(hasData: boolean = true) {
		super()
		this.hasData = hasData
	}

	public toMaybe<TM extends ResultResponse>(this: TM): Maybe<TM> {
		return this.hasData ? Maybe.Just(this) : Maybe.Nothing()
	}
}

export type ResultResponseConstructor = (new (isOk?: boolean, error?: any) => ResultResponse) & ITranslatable

/**
 * * Represents a response that may have useable data or have error.
 */
export abstract class ResultResponse extends Translatable {
	/**
	 * If `false`, other properties, except `error`, are unusable.
	 */
	public hasData: boolean = undefined

	/**
	 * Error object or message. Only usable when `hasData` is `false.
	 */
	public error: any = undefined

	constructor(isOk: boolean = true, error?: any) {
		super()
		this.hasData = isOk
		this.error = error
	}

	public toResult<TR extends ResultResponse>(this: TR): Result<TR> {
		if (this.hasData) {
			const { hasData, error, ...props }: any = this
			return Result.Ok(props)
		}
		return Result.Failure(this.error)
	}
}

export interface IAtomicRequest {
	/**
	 * In case an operation affects multiple records.
	 * If `true`, the operation must be successfull or failed for all records at once.
	 * Partial changes must be rolled back.
	 */
	readonly isAtomic?: boolean
}

export interface IMultiIds {
	readonly ids: string[]
	readonly tenantId?: string
}
