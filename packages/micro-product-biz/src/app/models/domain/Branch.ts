import { Moment } from 'moment'
import { Translatable } from '@micro-fleet/common'

import { momentify } from '../../utils/date-utils'

export class Branch extends Translatable {
	public id: string = undefined // Must be initialized, otherwise TypeScript compiler will remove it
	public name: string = undefined
	public createdAt: string = undefined
	public updatedAt?: string = undefined

	public get createdMoment(): Moment {
		return momentify(this.createdAt)
	}

	public get updatedMoment(): Moment {
		return this.updatedAt ? momentify(this.updatedAt) : null
	}
}
