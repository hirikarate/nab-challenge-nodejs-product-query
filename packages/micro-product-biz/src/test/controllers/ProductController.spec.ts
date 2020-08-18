import { expect } from 'chai'
import { stubInterface } from 'ts-sinon'

import {
	randomString,
	randomBigInt,
	randomInt,
	randomMoment,
} from '../shared/test-utils'
import * as dto from '../../app/contracts/dto/product'
import { IProductService } from '../../app/contracts/interfaces/IProductService'
import ProductController from '../../app/controllers/ProductController'


describe(ProductController.name, () => {

	describe(ProductController.prototype.create.name, () => {
		it('Should pass correct params to service method', async () => {
			// Arrange
			const request = dto.CreateProductRequest.from(<dto.CreateProductRequest> {
				name: randomString(50),
				color: randomString(10),
				price: randomInt(1e3, 10e3),
				status: randomInt(0, 2),
				branchIds: [randomBigInt(), randomBigInt()],
				categoryId: randomBigInt(),
			})

			const productService = stubInterface<IProductService>()
			productService.create.resolves(null)

			// Act
			const target = new ProductController(productService)
			await target.create(request)

			// Assert
			expect(productService.create.calledOnce).to.be.true
			expect(productService.create.calledOnce).to.be.true
		})

		it('Should return expected result from service method', async () => {
			// Arrange
			const request = dto.CreateProductRequest.from({
				name: randomString(50),
				color: randomString(10),
				price: randomInt(1e3, 10e3),
				status: randomInt(0, 2),
				branchIds: [randomBigInt(), randomBigInt()],
				categoryId: randomBigInt(),
			})
			const expectedResponse = dto.CreateProductResponse.from({
				...request,
				id: randomBigInt(),
				createdAt: randomMoment().format(),
			})

			const productService = stubInterface<IProductService>()
			productService.create.resolves(expectedResponse)

			const target = new ProductController(productService)

			// Act
			const actualResponse = await target.create(request)

			// Assert
			expect(productService.create.calledOnce).to.be.true
			expect(actualResponse).to.be.instanceOf(dto.CreateProductResponse)
			expect(actualResponse).to.deep.equal(expectedResponse)
		})

		it('Should throw error if service method throws one', async () => {
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

			const productService = stubInterface<IProductService>()
			productService.create.throws(expectedError)

			const target = new ProductController(productService)

			// Act
			let actualError
			try {
				await target.create(request)
				expect(true, 'Should not reach this point').to.be.false
			}
			catch (error) {
				actualError = error
			}

			// Assert
			expect(productService.create.calledOnce).to.be.true
			expect(actualError).to.be.instanceOf(Error)
			expect(actualError).to.deep.equal(expectedError)
		})
	})

})
