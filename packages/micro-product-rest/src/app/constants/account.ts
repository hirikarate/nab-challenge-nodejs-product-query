
export enum AccountStatus {
	/**
	 * User can log in with this account.
	 */
	ACTIVE = 'active',

	/**
	 * User cannot log in with this account.
	 * The lock may have a duration which once expires, account is re-activated.
	 */
	LOCKED = 'locked',

	/**
	 * The account is in the progress of being deleted and can be undone.
	 * The pending has a duration which once expires, the delete is undoable.
	 * Account is locked during this period.
	 */
	DELETE_PENDING = 'delpending',
}


export enum AccountEvent {
	/**
	 * Dispatched when an account is locked
	 */
	LOCKED = 'event.account.locked',

	/**
	 * Dispatched when account's password has been changed.
	 */
	PASSWORD_CHANGED = 'event.account.passwordchanged',

	/**
	 * Dispatched when an account is in delete progress
	 */
	PENDING_DELETED = 'event.account.pendingdel',

	/**
	 * Dispatched when an account has been permanently deleted.
	 */
	HARD_DELETED = 'event.account.harddeleted',
}


export type AccountLockedEventParams = {
	id: string,
}

export type AccountPasswordChangedEventParams = AccountLockedEventParams

export type AccountPendingDelEventParams = AccountLockedEventParams

export type AccountHardDeletedEventParams = AccountLockedEventParams
