import {
	assertArgNotEmpty
} from './validationHelpers';
import {
	CriticalException
} from './exceptionHelpers';


/**
 * A simple storage to keep dependencies decoupled with the place where it is used.
 * This is not a full-featured OOP IoC container which supports chain resolving.
 */
class DependencyContainer {
	#dependencyMap = null;

	constructor() {
		this.#dependencyMap = new Map();
	}

	/**
	 * Checks if a key has been registered.
	 * @param {string | symbol} key The identifier, any existing key will be overwritten.
	 * @returns {boolean}
	 */
	has(key) {
		assertArgNotEmpty("key", key);

		return this.#dependencyMap.has(key);
	}

	/**
	 * Adds a key and value to container.
	 * @param {string | symbol} key The identifier, any existing key will be overwritten.
	 * @param {any} value The value mapped with the key.
	 */
	register(key, value) {
		assertArgNotEmpty("key", key);

		this.#dependencyMap.set(key, value);
	}

	/**
	 * Attempts to resolve a dependency, throws a critical exception if key is not found.
	 * @param {string | symbol} key The identifier to look up.
	 */
	resolve(key) {
		assertArgNotEmpty("key", key);

		if (!this.#dependencyMap.has(key)) {
			throw new CriticalException(`The dependency ${key} is required but cannot be resolved`);
		}
		return this.#dependencyMap.get(key);
	}

	/**
	 * Attempts to resolve a dependency, returns `fallbackValue` if key is not found.
	 * @param {string | symbol} key The identifier to look up.
	 * @param {any} fallbackValue The identifier to look up.
	 */
	tryResolve(key, fallbackValue) {
		assertArgNotEmpty("key", key);

		return this.#dependencyMap.has(key) ?
			this.#dependencyMap.get(key) :
			fallbackValue;
	}

	/**
	 * Removes all dependency registries.
	 */
	reset() {
		this.#dependencyMap.clear();
	}
}


export default new DependencyContainer();
