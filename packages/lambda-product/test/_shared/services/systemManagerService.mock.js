class ParameterStoreMock {

	get allParams() {
		return {};
	}

	get isDebugEnabled() {
		return true;
	}

	init() {
		return Promise.resolve();
	}
}


const createParameterStore = () => new ParameterStoreMock();

export default createParameterStore;
