import {
	expect,
} from 'chai';
import * as sinon from 'sinon';

import dependencyContainer from '~shared/utils/dependencyContainer';
import {
	AssertionException,
	CriticalException,
} from '~src/_shared/utils/exceptionHelpers';
import {
	Maybe,
} from '~shared/utils/models/Maybe';
import * as testUtils from '~shared-test/test-helpers';


describe.skip('utils:serviceHelpers', function () {
	this.timeout(10000);

	let target;

	before(() => {
		testUtils.clearRequireCache();
		target = require('~shared/utils/serviceHelpers');
		testUtils.mockCommonDependencies();
	});

	after(() => {
		dependencyContainer.reset();
	});

	describe('mustSucceedFP', () => {
		it('Should bypass if the legacy result is successfull', () => {
			// Arrage
			const actionName = 'SuccessfullAction';
			const legacyResult = {
				success: true,
				data: {
					rows: [testUtils.randomString()],
				}
			};

			// Act
			let exception, actualResult;
			try {
				actualResult = target.mustHaveValueFP(actionName, null, true)(legacyResult);
			} catch(err) {
				exception = err;
			}

			// Assert
			exception && console.error(exception);
			expect(exception).not.to.exist;
			expect(actualResult).to.deep.equal(legacyResult);
		});

		it('Should throw error if the legacy result is not successfull', () => {
			// Arrage
			const actionName = 'FailedAction';
			const legacyResult = {
				success: false,
				data: testUtils.randomString(),
			};

			// Act
			let exception;
			try {
				target.mustHaveValueFP(actionName, null, true)(legacyResult);
			} catch(err) {
				exception = err;
			}

			// Assert
			expect(exception).to.be.instanceOf(CriticalException);
			expect(exception.message).to.be.equal(`Error while ${actionName}`);
		});

		it('Should bypass if the result is Maybe.Just', () => {
			// Arrage
			const actionName = 'SuccessfullAction';
			const expectedResult = Maybe.Just(testUtils.randomString());

			// Act
			let exception, actualResult;
			try {
				actualResult = target.mustHaveValueFP(actionName, null)(expectedResult);
			} catch(err) {
				exception = err;
			}

			// Assert
			exception && console.error(exception);
			expect(exception).not.to.exist;
			expect(actualResult).to.deep.equal(expectedResult);
		});

		it('Should throw error if the result is Maybe.Error', () => {
			// Arrage
			const actionName = 'FailedAction';
			const expectedResult = Maybe.Error(new Error());

			// Act
			let exception;
			try {
				target.mustHaveValueFP(actionName, null)(expectedResult);
			} catch(err) {
				exception = err;
			}

			// Assert
			expect(exception).to.be.instanceOf(CriticalException);
			expect(exception.message).to.be.equal(`Error while ${actionName}`);
		});
	});

	describe('mustHaveValueFP', () => {
		it('Should bypass if the legacy result is successfull and has value', () => {
			// Arrage
			const actionName = 'SuccessfullAction';
			const legacyResult = {
				success: true,
				data: {
					rows: [testUtils.randomString()],
				}
			};

			// Act
			let exception, actualResult;
			try {
				actualResult = target.mustHaveValueFP(actionName, null, true)(legacyResult);
			} catch(err) {
				exception = err;
			}

			// Assert
			exception && console.error(exception);
			expect(exception).not.to.exist;
			expect(actualResult).to.deep.equal(legacyResult);
		});

		it('Should throw error if the legacy result is not successfull', () => {
			// Arrage
			const actionName = 'FailedAction';
			const legacyResult = {
				success: false,
				data: testUtils.randomString(),
			};

			// Act
			let exception;
			try {
				target.mustHaveValueFP(actionName, null, true)(legacyResult);
			} catch(err) {
				exception = err;
			}

			// Assert
			expect(exception).to.be.instanceOf(CriticalException);
			expect(exception.message).to.be.equal(`Error while ${actionName}`);
		});

		it('Should throw error if the legacy result does not have value', () => {
			// Arrage
			const modelName = 'ValuelessModel';
			const legacyResult = {
				success: true,
				data: {
					rows: [],
				},
			};

			// Act
			let exception;
			try {
				target.mustHaveValueFP(null, modelName, true)(legacyResult);
			} catch(err) {
				exception = err;
			}

			// Assert
			expect(exception).to.be.instanceOf(AssertionException);
			expect(exception.message).to.be.equal(`Could not find ${modelName}`);
		});

		it('Should bypass if the result is Maybe.Just', () => {
			// Arrage
			const actionName = 'SuccessfullAction';
			const expectedResult = Maybe.Just(testUtils.randomString());

			// Act
			let exception, actualResult;
			try {
				actualResult = target.mustHaveValueFP(actionName, null)(expectedResult);
			} catch(err) {
				exception = err;
			}

			// Assert
			exception && console.error(exception);
			expect(exception).not.to.exist;
			expect(actualResult).to.deep.equal(expectedResult);
		});

		it('Should throw error if the result is Maybe.Error', () => {
			// Arrage
			const actionName = 'FailedAction';
			const expectedResult = Maybe.Error(new Error());

			// Act
			let exception;
			try {
				target.mustHaveValueFP(actionName, null)(expectedResult);
			} catch(err) {
				exception = err;
			}

			// Assert
			expect(exception).to.be.instanceOf(CriticalException);
			expect(exception.message).to.be.equal(`Error while ${actionName}`);
		});

		it('Should throw error if the result is Maybe.Nothing', () => {
			// Arrage
			const modelName = 'ValuelessModel';
			const expectedResult = Maybe.Nothing();

			// Act
			let exception;
			try {
				target.mustHaveValueFP(null, modelName)(expectedResult);
			} catch(err) {
				exception = err;
			}

			// Assert
			expect(exception).to.be.instanceOf(AssertionException);
			expect(exception.message).to.be.equal(`Could not find ${modelName}`);
		});
	});

	describe('withServiceErrorHandler', () => {
		it('Should invoke wrapped function with provided arguments', async () => {
			// Arrange
			const paramOne = testUtils.randomString();
			const paramTwo = testUtils.randomInt();
			const paramThree = testUtils.randomMoment();
			const spy = sinon.spy();
			const wrapped = target.withServiceErrorHandler('WrappedArguments')(spy);

			// Act
			await wrapped(paramOne, paramTwo, paramThree);

			// Assert
			expect(spy.calledOnce).to.be.true;
			const firstCallArgs = spy.args[0];
			expect(firstCallArgs.length).to.equal(3);
			expect(firstCallArgs[0]).to.equal(paramOne);
			expect(firstCallArgs[1]).to.equal(paramTwo);
			expect(firstCallArgs[2]).to.equal(paramThree);
		});

		it('Should return a sync result if success', async () => {
			// Arrange
			const expectedResult = testUtils.randomString();
			const spy = sinon.fake.returns(expectedResult);
			const wrapped = target.withServiceErrorHandler('SyncResultSuccess')(spy);

			// Act
			const actualResult = await wrapped();

			// Assert
			expect(spy.calledOnce).to.be.true;
			expect(actualResult).to.equal(expectedResult);
		});

		it('Should return a async result if success', async () => {
			// Arrange
			const expectedResult = testUtils.randomUuid();
			const spy = sinon.fake.resolves(expectedResult);
			const wrapped = target.withServiceErrorHandler('AsyncResultSuccess')(spy);

			// Act
			const actualResult = await wrapped();

			// Assert
			expect(spy.calledOnce).to.be.true;
			expect(actualResult).to.equal(expectedResult);
		});

		it('Should return a legacy result if failed', async () => {
			// Arrange
			const expectedError = new Error('TESTING EXPECTED LegacyError');
			const spy = sinon.fake.throws(expectedError);
			const wrapped = target.withServiceErrorHandler('LegacyError', true)(spy);

			// Act
			const result = await wrapped();

			// Assert
			expect(spy.calledOnce).to.be.true;
			expect(result.success).to.be.false;
			expect(result.data).to.equal(expectedError);
		});

		it('Should return a Maybe.Error if failed', async () => {
			// Arrange
			const expectedError = new Error('TESTING EXPECTED Maybe.Error');
			const spy = sinon.fake.throws(expectedError);
			const wrapped = target.withServiceErrorHandler('MaybeError')(spy);

			// Act
			const result = await wrapped();

			// Assert
			expect(spy.calledOnce).to.be.true;
			expect(Maybe.isError(result)).to.be.true;
			expect(result.error).to.equal(expectedError);
		});
	});


}); // END describe 'utils:serviceHelpers'
