import AWS from './awsSDK';


const env = process.env.SLS_ENV || process.env.stage;


/**
 * Provide functionalities to prefetch and manage AWS System Manager's Parameter Store.
 */
class ParameterStore {
	#ssm = null;

	#params = {};

	constructor(ssmInstance) {
		this.#ssm = ssmInstance;
		this.#params = {};
	}

	get allParams() {
		return this.#params;
	}

	/**
	 * Indicates whether global debug is enabled.
	 * @returns {boolean}
	 */
	get isDebugEnabled() {
		// eslint-disable-next-line no-prototype-builtins
		if (!this.#params.hasOwnProperty(ParameterStore.paramNames.DEBUG)) {
			return true; // Default DEBUG is enabled.
		}
		return (this.#params[ParameterStore.paramNames.DEBUG] === 'true');
	}


	/**
	 * Prefetches parameters from SSM.
	 */
	async init() {
		let fetchedParams;
		try {
			const results = await this.#ssm
				.getParameters({
					Names: [
						ParameterStore.paramNames.DEBUG,
					],
					WithDecryption: false,
				})
				.promise();

			fetchedParams = results.Parameters.reduce(
				(prev, cur) => {
					prev[cur.Name] = cur.Value;
					return prev;
				},
				{},
			);
		} catch (error) {
			if (typeof error.message === 'string' && error.message.includes('EPROTO')) {
				fetchedParams = {};
			} else {
				throw error;
			}
		}
		this.#params = Object.freeze(fetchedParams);
	}
}


ParameterStore.paramNames = Object.freeze({
	DEBUG: `sm-debug-${env}`,
});


export function createParameterStore() {
	const ssm = new AWS.SSM({
		apiVersion: '2014-11-06'
	});

	return new ParameterStore(ssm);
}
