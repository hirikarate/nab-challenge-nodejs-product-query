/* eslint-disable import/no-extraneous-dependencies */
import { expect } from 'chai'
import { stubInterface } from 'ts-sinon'
import { IIdProvider } from '@micro-fleet/id-generator'

import {
	randomString,
	randomBigInt,
	randomInt,
	randomMoment,
} from '../shared/test-utils'
import * as dto from '../../app/contracts/dto/product'
import { Product } from '../../app/models/domain/Product'
import { IProductRepository } from '../../app/repositories/ProductRepository'
import { ProductService } from '../../app/services/ProductService'


describe(ProductService.name, () => {

	describe(ProductService.prototype.create.name, () => {
		it('Should pass correct domain model to repository method', async () => {
			// Arrange
			const request = dto.CreateProductRequest.from({
				name: randomString(50),
				color: randomString(10),
				price: randomInt(1e3, 10e3),
				status: randomInt(0, 2),
				branchIds: [randomBigInt(), randomBigInt()],
				categoryId: randomBigInt(),
			})
			const expectedId = randomBigInt(false)
			const expectedArg = Product.from({
				...request,
				id: expectedId.toString(),
			})

			const idProvider = stubInterface<IIdProvider>()
			idProvider.nextBigInt.returns(expectedId as bigint)
			const productRepo = stubInterface<IProductRepository>()
			productRepo.create.resolves(null)

			// Act
			const target = new ProductService(null, productRepo, idProvider)
			await target.create(request)

			// Assert
			expect(productRepo.create.calledOnce).to.be.true

			// Assert: Service should generate an ID
			const firstArg = productRepo.create.firstCall.args[0]
			expect(firstArg).to.be.instanceOf(Product)
			expect(typeof firstArg.id).to.equal('string')
			expect(firstArg.id).to.equal(expectedId.toString())
			expect(firstArg).to.deep.equal(expectedArg)
		})

		it('Should convert domain model from repository to correct service response', async () => {
			// Arrange
			const request = dto.CreateProductRequest.from({
				name: randomString(50),
				color: randomString(10),
				price: randomInt(1e3, 10e3),
				status: randomInt(0, 2),
				branchIds: [randomBigInt(), randomBigInt()],
				categoryId: randomBigInt(),
			})
			const expectedId = randomBigInt(false)
			const domainModel = Product.from({
				...request,
				id: expectedId.toString(),
				createdAt: randomMoment().format(),
			})
			const expectedResponse = dto.CreateProductResponse.from(domainModel)

			const idProvider = stubInterface<IIdProvider>()
			idProvider.nextBigInt.returns(expectedId as bigint)
			const productRepo = stubInterface<IProductRepository>()
			productRepo.create.resolves(domainModel)

			// Act
			const target = new ProductService(null, productRepo, idProvider)
			const actualResponse = await target.create(request)

			// Assert
			expect(productRepo.create.calledOnce).to.be.true
			expect(actualResponse).to.be.instanceOf(dto.CreateProductResponse)
			expect(actualResponse).to.deep.equal(expectedResponse)
		})

		it('Should return error response if business rules do not match', async () => {
			// Arrange
			const request = dto.CreateProductRequest.from({
				name: `${randomString(10)} SHIT ${randomString(10)}`, // Contains banned word
				color: randomString(10),
				price: randomInt(1e3, 10e3),
				status: randomInt(0, 2),
				branchIds: [randomBigInt(), randomBigInt()],
				categoryId: randomBigInt(),
			})
			const expectedResponse = dto.CreateProductResponse.from({
				hasData: false,
				error: 'PRODUCT_NAME_WITH_BANNED_WORDS',
				id: undefined,
				createdAt: undefined,
			})
			const idProvider = stubInterface<IIdProvider>()
			idProvider.nextBigInt.returns(randomBigInt(false) as bigint)
			const productRepo = stubInterface<IProductRepository>()

			// Act
			const target = new ProductService(null, productRepo, idProvider)
			const actualResponse = await target.create(request)

			// Assert
			expect(productRepo.create.called).to.be.false
			expect(actualResponse).to.be.instanceOf(dto.CreateProductResponse)
			expect(actualResponse).to.be.deep.equal(expectedResponse)
		})


		it('Should throw error if repository method throws one', async () => {
			// Arrange
			const request = dto.CreateProductRequest.from({
				name: randomString(50),
				color: randomString(10),
				price: randomInt(1e3, 10e3),
				status: randomInt(0, 2),
				branchIds: [randomBigInt(), randomBigInt()],
				categoryId: randomBigInt(),
			})
			const expectedError = new Error('AN_EXPECTED_ERROR')
			const idProvider = stubInterface<IIdProvider>()
			idProvider.nextBigInt.returns(randomBigInt(false) as bigint)
			const productRepo = stubInterface<IProductRepository>()
			productRepo.create.rejects(expectedError)

			// Act
			const target = new ProductService(null, productRepo, idProvider)
			let actualError
			try {
				await target.create(request)
				expect(true, 'Should not reach this point').to.be.false
			}
			catch (error) {
				actualError = error
			}

			// Assert
			expect(productRepo.create.calledOnce).to.be.true
			expect(actualError).to.be.instanceOf(Error)
			expect(actualError).to.deep.equal(expectedError)
		})

	}) // describe CREATE

})
