import { Newable } from '@micro-fleet/common'
import { addFilterToTarget, FilterPriority } from '@micro-fleet/web'

import { AuthorizeFilter } from './AuthorizeFilter'


export type AuthorizedDecorator = () => Function


/**
 * Marks a controller or action to require authentication token to be accessible.
 */
export function authorized(): Function {
	return function (TargetClass: Newable, key: string): Function {
		return addFilterToTarget<AuthorizeFilter>(AuthorizeFilter, TargetClass, key, FilterPriority.HIGH) as Newable
	}
}
