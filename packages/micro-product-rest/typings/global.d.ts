/* eslint-disable import/no-extraneous-dependencies */
declare module 'ts-sinon' {
	import * as sinon from 'sinon'

	export declare type StubbedInstance<T> = sinon.SinonStubbedInstance<T> & T
	/**
	 * @param methods passing map of methods has become @deprecated as it may lead to overwriting stubbed method type
	 */
	export declare function stubObject<T extends object>(object: T, methods?: string[] | object): StubbedInstance<T>
	export declare function stubConstructor<T extends new (...args: any[]) => any>(
		constructor: T, ...constructorArgs: ConstructorParameters<T> | undefined[]): StubbedInstance<InstanceType<T>>
	/**
	 * @param methods passing map of methods has become @deprecated as it may lead to overwriting stubbed method type
	 */
	export declare function stubInterface<T extends object>(methods?: object): StubbedInstance<T>
	export default sinon
}
