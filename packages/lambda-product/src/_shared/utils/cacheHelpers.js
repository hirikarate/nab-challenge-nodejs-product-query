import * as cacheManager from 'cache-manager';


/**
* Creates new instance of `cache-manager`.
* @param {object?} options This object has same format as `cacheManager.caching()` options param.
*/
export function createMemoryCache(options) {
	const opts = Object.assign(
		{
			store: 'memory',
			max: 100,
			ttl: 5,
		},
		options,
	);

	return cacheManager.caching(opts);
}


/**
* Wraps `targetFn` in a cache.
*
* @param {string} functionName Function name to build cache key
* @param {object?} options from lib 'cache-manager'
* }
* @param {function} targetFn The function whose returned value will be cached.
*/
export const withCache = (functionName, options={}) => (targetFn) =>
	(...args) => {
		const cacheKey = generateCacheKey(args, functionName);
		const memoryCache = createMemoryCache(options);
		return memoryCache.wrap(cacheKey, () => {
			return targetFn(...args);
		});
	};


/**
* Generates cache key in snake_style
*
* @param {string|number|object|array} values A string, number, flat object,
*	 or an array of these types.
* @param {string?} prefix An optional string to prepend to cache key.
*/
function generateCacheKey(values, prefix) {
	let keyFactors = [];
	prefix && keyFactors.push(prefix);

	if (Array.isArray(values)) {
		keyFactors = keyFactors.concat(
			values.map(generateCacheKey), // In recursion, there is no `prefix`.
		);
	} else if (typeof values === "object") {
		keyFactors = keyFactors.concat(Object.values(values));
	} else {
		keyFactors.push(String(values));
	}
	return keyFactors.join('_');
}
