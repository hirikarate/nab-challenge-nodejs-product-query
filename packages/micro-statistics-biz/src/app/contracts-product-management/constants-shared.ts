// Do not use "SortType" in @micro-fleet/persistence because
// this file is copy to REST service which doesn't depends on @micro-fleet/persistence.
export enum SortType {
	ASC = 'asc',
	DESC = 'desc',
}

export enum ProductStatus {
	/**
	 * The product is available for selling.
	 */
	NOT_ON_SALE = 0,

	/**
	 * The product is not available for selling.
	 */
	ON_SALE = 1,

	/**
	 * The product is recalled by its manufacturer.
	 */
	RECALLED = 2,
}
