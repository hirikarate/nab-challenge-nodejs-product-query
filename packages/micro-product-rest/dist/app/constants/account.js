"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountEvent = exports.AccountStatus = void 0;
var AccountStatus;
(function (AccountStatus) {
    /**
     * User can log in with this account.
     */
    AccountStatus["ACTIVE"] = "active";
    /**
     * User cannot log in with this account.
     * The lock may have a duration which once expires, account is re-activated.
     */
    AccountStatus["LOCKED"] = "locked";
    /**
     * The account is in the progress of being deleted and can be undone.
     * The pending has a duration which once expires, the delete is undoable.
     * Account is locked during this period.
     */
    AccountStatus["DELETE_PENDING"] = "delpending";
})(AccountStatus = exports.AccountStatus || (exports.AccountStatus = {}));
var AccountEvent;
(function (AccountEvent) {
    /**
     * Dispatched when an account is locked
     */
    AccountEvent["LOCKED"] = "event.account.locked";
    /**
     * Dispatched when account's password has been changed.
     */
    AccountEvent["PASSWORD_CHANGED"] = "event.account.passwordchanged";
    /**
     * Dispatched when an account is in delete progress
     */
    AccountEvent["PENDING_DELETED"] = "event.account.pendingdel";
    /**
     * Dispatched when an account has been permanently deleted.
     */
    AccountEvent["HARD_DELETED"] = "event.account.harddeleted";
})(AccountEvent = exports.AccountEvent || (exports.AccountEvent = {}));
//# sourceMappingURL=account.js.map