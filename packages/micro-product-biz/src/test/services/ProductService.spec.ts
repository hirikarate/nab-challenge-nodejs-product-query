/* eslint-disable import/no-extraneous-dependencies */
import { expect } from 'chai'
import { stubInterface } from 'ts-sinon'
import { BusinessInvariantError } from '@micro-fleet/common'
import { IIdProvider } from '@micro-fleet/id-generator'

import {
	randomString,
	randomBigInt,
	randomInt,
	randomMoment,
} from '../shared/test-utils'
import * as bdto from '../../app/contracts/dto/branch'
import * as cdto from '../../app/contracts/dto/category'
import * as pdto from '../../app/contracts/dto/product'
import { IBranchService } from '../../app/contracts/interfaces/IBranchService'
import { ICategoryService } from '../../app/contracts/interfaces/ICategoryService'
import { Product } from '../../app/models/domain/Product'
import { IProductRepository } from '../../app/repositories/ProductRepository'
import { ProductService } from '../../app/services/ProductService'


describe(ProductService.name, () => {

	describe(ProductService.prototype.create.name, () => {
		it('Should pass correct domain model to repository method', async () => {
			// Arrange
			const request = pdto.CreateProductRequest.from({
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

			const idProvider = mockIdProvider(expectedId as bigint)
			const productRepo = mockProductRepo(null)
			const branchSvc = mockBranchSvc()
			const categorySvc = mockCategorySvc()

			// Act
			const target = new ProductService(null, productRepo, idProvider, branchSvc, categorySvc)
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
			const request = pdto.CreateProductRequest.from({
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
			const expectedResponse = pdto.CreateProductResponse.from(domainModel)

			const idProvider = mockIdProvider(expectedId as bigint)
			const productRepo = mockProductRepo(domainModel)
			const branchSvc = mockBranchSvc()
			const categorySvc = mockCategorySvc()

			// Act
			const target = new ProductService(null, productRepo, idProvider, branchSvc, categorySvc)
			const actualResponse = await target.create(request)

			// Assert
			expect(productRepo.create.calledOnce).to.be.true
			expect(actualResponse).to.be.instanceOf(pdto.CreateProductResponse)
			expect(actualResponse).to.deep.equal(expectedResponse)
		})

		it('Should return error response if product name contains banned words', async () => {
			// Arrange
			const request = pdto.CreateProductRequest.from({
				name: `${randomString(10)} SHIT ${randomString(10)}`, // Contains banned word
				color: randomString(10),
				price: randomInt(1e3, 10e3),
				status: randomInt(0, 2),
				branchIds: [randomBigInt(), randomBigInt()],
				categoryId: randomBigInt(),
			})
			const expectedResponse = pdto.CreateProductResponse.from({
				hasData: false,
				error: new BusinessInvariantError({
					message: 'PRODUCT_NAME_WITH_BANNED_WORDS',
					path: ['name'],
					value: request.name,
				}),
				id: undefined,
				createdAt: undefined,
			})
			const idProvider = mockIdProvider(randomBigInt(false) as bigint)
			const productRepo = mockProductRepo(null)
			const branchSvc = mockBranchSvc()
			const categorySvc = mockCategorySvc()

			// Act
			const target = new ProductService(null, productRepo, idProvider, branchSvc, categorySvc)
			const actualResponse = await target.create(request)

			// Assert
			expect(productRepo.create.called).to.be.false
			expect(actualResponse).to.be.instanceOf(pdto.CreateProductResponse)
			expect(actualResponse).to.be.deep.equal(expectedResponse)
		})

		it('Should return error response if branch IDs do not exist', async () => {
			// Arrange
			const request = pdto.CreateProductRequest.from({
				name: randomString(50),
				color: randomString(10),
				price: randomInt(1e3, 10e3),
				status: randomInt(0, 2),
				branchIds: [randomBigInt(), randomBigInt()],
				categoryId: randomBigInt(),
			})
			const expectedResponse = pdto.CreateProductResponse.from({
				hasData: false,
				error: new BusinessInvariantError({
					message: 'BRANCHES_NOT_EXISTING',
					path: ['branchIds'],
					value: request.branchIds,
				}),
				id: undefined,
				createdAt: undefined,
			})
			const idProvider = mockIdProvider(randomBigInt(false) as bigint)
			const productRepo = mockProductRepo(null)
			const branchSvc = mockBranchSvc(false) // Branches not existing
			const categorySvc = mockCategorySvc()

			// Act
			const target = new ProductService(null, productRepo, idProvider, branchSvc, categorySvc)
			const actualResponse = await target.create(request)

			// Assert
			expect(productRepo.create.called).to.be.false
			expect(actualResponse).to.be.instanceOf(pdto.CreateProductResponse)
			expect(actualResponse).to.be.deep.equal(expectedResponse)
		})

		it('Should return error response if category ID does not exist', async () => {
			// Arrange
			const request = pdto.CreateProductRequest.from({
				name: randomString(50),
				color: randomString(10),
				price: randomInt(1e3, 10e3),
				status: randomInt(0, 2),
				branchIds: [randomBigInt(), randomBigInt()],
				categoryId: randomBigInt(),
			})
			const expectedResponse = pdto.CreateProductResponse.from({
				hasData: false,
				error: new BusinessInvariantError({
					message: 'CATEGORY_NOT_EXISTING',
					path: ['categoryId'],
					value: request.categoryId,
				}),
				id: undefined,
				createdAt: undefined,
			})
			const idProvider = mockIdProvider(randomBigInt(false) as bigint)
			const productRepo = mockProductRepo(null)
			const branchSvc = mockBranchSvc()
			const categorySvc = mockCategorySvc(false) // Category not existing

			// Act
			const target = new ProductService(null, productRepo, idProvider, branchSvc, categorySvc)
			const actualResponse = await target.create(request)

			// Assert
			expect(productRepo.create.called).to.be.false
			expect(actualResponse).to.be.instanceOf(pdto.CreateProductResponse)
			expect(actualResponse).to.be.deep.equal(expectedResponse)
		})

		it('Should return error response if all business rule violations', async () => {
			// Arrange
			const request = pdto.CreateProductRequest.from({
				name: `${randomString(10)} SHIT ${randomString(10)}`, // Contains banned word
				color: randomString(10),
				price: randomInt(1e3, 10e3),
				status: randomInt(0, 2),
				branchIds: [randomBigInt(), randomBigInt()],
				categoryId: randomBigInt(),
			})
			const expectedResponse = pdto.CreateProductResponse.from({
				hasData: false,
				error: new BusinessInvariantError([
					{
						message: 'PRODUCT_NAME_WITH_BANNED_WORDS',
						path: ['name'],
						value: request.name,
					},
					{
						message: 'BRANCHES_NOT_EXISTING',
						path: ['branchIds'],
						value: request.branchIds,
					},
					{
						message: 'CATEGORY_NOT_EXISTING',
						path: ['categoryId'],
						value: request.categoryId,
					},
				]),
				id: undefined,
				createdAt: undefined,
			})
			const idProvider = mockIdProvider(randomBigInt(false) as bigint)
			const productRepo = mockProductRepo(null)
			const branchSvc = mockBranchSvc(false) // Branches not existing
			const categorySvc = mockCategorySvc(false) // Category not existing

			// Act
			const target = new ProductService(null, productRepo, idProvider, branchSvc, categorySvc)
			const actualResponse = await target.create(request)

			// Assert
			expect(productRepo.create.called).to.be.false
			expect(actualResponse).to.be.instanceOf(pdto.CreateProductResponse)
			expect(actualResponse).to.be.deep.equal(expectedResponse)
		})

		it('Should throw error if repository method throws one', async () => {
			// Arrange
			const request = pdto.CreateProductRequest.from({
				name: randomString(50),
				color: randomString(10),
				price: randomInt(1e3, 10e3),
				status: randomInt(0, 2),
				branchIds: [randomBigInt(), randomBigInt()],
				categoryId: randomBigInt(),
			})
			const expectedError = new Error('AN_EXPECTED_ERROR')
			const idProvider = mockIdProvider(randomBigInt(false) as bigint)
			const productRepo = mockProductRepo(expectedError, true)
			const branchSvc = mockBranchSvc()
			const categorySvc = mockCategorySvc()

			// Act
			const target = new ProductService(null, productRepo, idProvider, branchSvc, categorySvc)
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


	function mockIdProvider(expectedId: bigint) {
		const idProvider = stubInterface<IIdProvider>()
		idProvider.nextBigInt.returns(expectedId)
		return idProvider
	}

	function mockBranchSvc(isExisting = true) {
		const branchSvc = stubInterface<IBranchService>()
		branchSvc.exists.resolves(bdto.CheckBranchExistingResponse.from({
			isExisting,
		}))
		return branchSvc
	}

	function mockCategorySvc(isExisting = true) {
		const categorySvc = stubInterface<ICategoryService>()
		categorySvc.exists.resolves(cdto.CheckCategoryExistingResponse.from({
			isExisting,
		}))
		return categorySvc
	}

	function mockProductRepo(valOrError: any, isReject = false) {
		const productRepo = stubInterface<IProductRepository>()
		if (isReject) productRepo.create.rejects(valOrError)
		else productRepo.create.resolves(valOrError)

		return productRepo
	}

})
