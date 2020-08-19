/* eslint-disable import/no-extraneous-dependencies */
import { expect } from 'chai'
import * as sinon from 'sinon'
import { stubInterface } from 'ts-sinon'
import { QueryBuilder } from 'objection'
import { DependencyContainer } from '@micro-fleet/common'
import { IDatabaseConnector, QueryCallback, AtomicSession } from '@micro-fleet/persistence'

import {
	randomString,
	randomBigInt,
	randomInt,
	randomMoment,
} from '../shared/test-utils'
import { Product } from '../../app/models/domain/Product'
import { ProductORM } from '../../app/models/orm/ProductORM'
import { ProductRepository } from '../../app/repositories/ProductRepository'


describe(ProductRepository.name, () => {

	let depContainer: DependencyContainer


	beforeEach(() => {
		depContainer = new DependencyContainer()
	})

	afterEach(() => {
		depContainer.dispose()
	})

	describe(ProductRepository.prototype.create.name, () => {
		it('Should build correct query with query builder', async () => {
			// Arrange
			const queryResults: any[] = [] // `insertGraph` resolves to array
			const queryBuilder = stubInterface<QueryBuilder<ProductORM>>()
			queryBuilder.insertGraph.returnsThis()
			queryBuilder.returning.callsFake((..._: any[]) => {
				const promise = Promise.resolve(queryResults) as any
				promise.toSql = sinon.fake.returns('MOCK QUERY SQL')
				return promise
			})

			const fakePrepare = (ORMClass: any, callback: QueryCallback<ProductORM>, _: AtomicSession) => {
				expect(ORMClass).to.equal(ProductORM)
				return callback(queryBuilder as any)
			}
			const dbConnector = stubInterface<IDatabaseConnector>()
			dbConnector.prepare.callsFake(fakePrepare as any)

			// Act
			const target = new ProductRepository(dbConnector)
			await target.create(null)

			// Assert
			expect(queryBuilder.insertGraph.calledOnce).to.be.true
			expect(queryBuilder.returning.calledOnce).to.be.true
			expect(queryBuilder.returning.firstCall.args[0]).to.equal('*')
		})

		it('Should pass correct ORM model to query builder', async () => {
			// Arrange
			const inputDomainModel = Product.from({
				id: randomBigInt(),
				name: randomString(50),
				color: randomString(10),
				price: randomInt(1e3, 10e3),
				status: randomInt(0, 2),
				branchIds: [randomBigInt(), randomBigInt()],
				categoryId: randomBigInt(),
			})
			const expectedEntityORM = ProductORM.getTranslator().whole(inputDomainModel, { enableValidation: false })
			const queryResults: any[] = [] // `insertGraph` resolves to array

			const queryBuilder = stubInterface<QueryBuilder<ProductORM>>()
			queryBuilder.insertGraph.returnsThis()
			queryBuilder.returning.callsFake((..._: any[]) => {
				const promise = Promise.resolve(queryResults) as any
				promise.toSql = sinon.fake.returns('MOCK QUERY SQL')
				return promise
			})

			const fakePrepare = (_: any, callback: QueryCallback<ProductORM>, __: any) =>
				callback(queryBuilder as any)

			const dbConnector = stubInterface<IDatabaseConnector>()
			dbConnector.prepare.callsFake(fakePrepare as any)

			// Act
			const target = new ProductRepository(dbConnector)
			await target.create(inputDomainModel)

			// Assert: `insertGraph` is called with correct ORM model
			const { args } = queryBuilder.insertGraph.firstCall as any
			const [actualEntityORM] = args[0]
			expect(actualEntityORM).to.be.instanceOf(ProductORM)
			expect(actualEntityORM).to.deep.equal(expectedEntityORM)
		})

		it('Should convert query result to correct domain model object', async () => {
			// Arrange
			const inputDomainModel = Product.from({
				id: randomBigInt(),
				name: randomString(50),
				color: randomString(10),
				price: randomInt(1e3, 10e3),
				status: randomInt(0, 2),
				branchIds: [randomBigInt(), randomBigInt()],
				categoryId: randomBigInt(),
			})
			const expectedOutputDomainModel = Product.from({
				...inputDomainModel,
				branchIds: undefined,
				createdAt: randomMoment().format(),
			})
			const entityORM = ProductORM.getTranslator().whole(expectedOutputDomainModel, { enableValidation: false })
			const queryResults = [entityORM] // `insertGraph` resolves to array

			const queryBuilder = stubInterface<QueryBuilder<ProductORM>>()
			queryBuilder.insertGraph.returnsThis()
			queryBuilder.returning.callsFake((..._: any[]) => {
				const promise = Promise.resolve(queryResults) as any
				promise.toSql = sinon.fake.returns('MOCK QUERY SQL')
				return promise
			})

			const fakePrepare = (_: any, callback: QueryCallback<ProductORM>, __: any) =>
				callback(queryBuilder as any)

			const dbConnector = stubInterface<IDatabaseConnector>()
			dbConnector.prepare.callsFake(fakePrepare as any)

			// Act
			const target = new ProductRepository(dbConnector)
			const actualDomainModel = await target.create(inputDomainModel)

			// Assert
			expect(actualDomainModel).to.be.instanceOf(Product)
			expect(actualDomainModel).to.deep.equal(expectedOutputDomainModel)
		})


	}) // describe CREATE

})
