
export default class LogServiceMock {

	info(message) {
	}

	debug(message, ...meta) {
		// console.log({
		//		 _CONTEXT: this.contextName,
		//	 },
		//	 message,
		//	 ...meta,
		// );
	}

	error(error, ...meta) {
		console.error({
				_CONTEXT: this.contextName,
			},
			error,
			...meta,
		);
	}

	log(level, message, ...meta) {
	}

	newContext(contextName) {
		this.contextName = contextName;
		return this;
	}

	init() {
		return Promise.resolve();
	}
}
