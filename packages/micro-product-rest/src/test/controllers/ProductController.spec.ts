/* eslint-disable prefer-arrow-callback */
import * as path from 'path'

import { expect } from 'chai'
import axios, { AxiosResponse, AxiosError } from 'axios'
import * as sinon from 'sinon'
import { stubInterface } from 'ts-sinon'
import {
	constants,
	DependencyContainer,
	serviceContext,
	ValidationError,
} from '@micro-fleet/common'
import {
	ExpressServerAddOn,
	ControllerCreationStrategy,
	ErrorHandlerFilter,
} from '@micro-fleet/web'

import * as dto from '../../app/contracts-product-management/dto/product'
import { IProductService } from '../../app/contracts-product-management/interfaces/IProductService'
import { Types as T } from '../../app/constants/Types'
import ProductController from '../../app/controllers/ProductController'
import { createExpressMockServer } from '../shared/mock-web-addon'
import {
	randomString,
	randomInt,
	randomBigInt,
	randomMoment,
} from '../shared/test-utils'


const { Web: W } = constants
const PORT = 31000
const URL_PREFIX = '/api/v1'
const BASE_URL = `http://localhost:${PORT}${URL_PREFIX}/products`

describe('ProductController', () => {

	let server: ExpressServerAddOn
	let depContainer: DependencyContainer

	function createServer(configs: object = {}): ExpressServerAddOn {
		({ server, depContainer } = createExpressMockServer({ configs }))
		serviceContext.setDependencyContainer(depContainer)
		server.controllerCreation = ControllerCreationStrategy.SINGLETON
		server.controllerPath = path.resolve(__dirname, './product-controller-export')
		return server
	}


	beforeEach(() => {
		server = createServer({
			[W.WEB_URL_PREFIX]: URL_PREFIX,
			[W.WEB_PORT]: PORT,
		})
		server.addGlobalErrorHandler(ErrorHandlerFilter)
	})

	afterEach(async () => {
		depContainer.dispose()
		await server.dispose()
		depContainer = server = null
		serviceContext.setDependencyContainer(null)
	})

	describe('create', () => {
		it('Should respond with validation error if request payload is invalid', async () => {
			// Arrange
			const productService = stubInterface<IProductService>()
			depContainer.bindConstant(T.PRODUCT_DIRECT_SVC, productService)
			depContainer.bindConstant(T.PRODUCT_MEDIATE_SVC, productService)

			const payload = {
				name: randomString(2),
				price: randomInt(-100, -1),
				color: randomString(51),
				branchIds: '12Three45',
				status: randomInt(3, 10),
			}

			await server.init()
			try {
				await axios.post(`${BASE_URL}`, payload)
				expect(true, 'Should not reach here').to.be.false
			}
			catch (err) {
				// Assert
				expect((err as AxiosError).response.status).to.equal(422)
				const data: ValidationError[] = (err as AxiosError).response.data
				expect(Array.isArray(data)).to.be.true
				expect(data.length).to.equal(7)
				expect(data[0].message).to.equal('"name" length must be at least 3 characters long')
				expect(data[1].message).to.equal('"price" must be larger than or equal to 0')
				expect(data[2].message).to.equal('"color" length must be less than or equal to 50 characters long')
				expect(data[3].message).to.equal('"branchIds" with value "12Three45" fails'
					+ ' to match the required pattern: /^\\d+$/')
				expect(data[4].message).to.equal('"branchIds" does not contain 1 required value(s)')
				expect(data[5].message).to.equal('"categoryId" is required')
				expect(data[6].message).to.equal('"status" must be one of [0, 1, 2]')
			}
		})

		it('Should pass correct params to service method', async () => {
			// Arrange
			const payload = {
				name: randomString(50),
				price: randomInt(0, 100e6),
				color: randomString(50),
				branchIds: randomBigInt(),
				categoryId: randomBigInt(),
				status: randomInt(0, 2),
			}
			const expectedRequest = dto.CreateProductRequest.from(payload)

			const productService = stubInterface<IProductService>()
			productService.create.resolves(new dto.CreateProductResponse(false))
			depContainer.bindConstant(T.PRODUCT_DIRECT_SVC, productService)
			depContainer.bindConstant(T.PRODUCT_MEDIATE_SVC, productService)

			await server.init() // Web server starts listening
			const controller = depContainer.resolve<ProductController>(ProductController.name)
			const createSpy = sinon.spy(controller, 'create')

			// Act
			let response: AxiosResponse
			try {
				response = await axios.post(`${BASE_URL}`, payload)
			}
			catch (err) {
				// console.error(err.response)
				expect(err).not.to.exist
			}

			// Assert
			expect(response.status).to.equal(200)
			expect(createSpy.calledOnce).to.be.true
			expect(productService.create.firstCall.args[0]).to.deep.equal(expectedRequest)
		})

		it('Should return expected result from service method', async () => {
			// Arrange
			const payload = {
				name: randomString(50),
				price: randomInt(0, 100e6),
				color: randomString(50),
				branchIds: randomBigInt(),
				categoryId: randomBigInt(),
				status: randomInt(0, 2),
			}
			const expectedResponse = dto.CreateProductResponse.from({
				...payload,
				id: randomBigInt(),
				createdAt: randomMoment().format(),
			})
			delete expectedResponse.error

			const productService = stubInterface<IProductService>()
			productService.create.resolves(expectedResponse)
			depContainer.bindConstant(T.PRODUCT_DIRECT_SVC, productService)
			depContainer.bindConstant(T.PRODUCT_MEDIATE_SVC, productService)

			await server.init() // Web server starts listening
			const controller = depContainer.resolve<ProductController>(ProductController.name)
			const createSpy = sinon.spy(controller, 'create')

			// Act
			let response: AxiosResponse
			try {
				response = await axios.post(`${BASE_URL}`, payload)
			}
			catch (err) {
				// console.error(err.response)
				expect(err).not.to.exist
			}

			// Assert
			expect(response.status).to.equal(200)
			expect(createSpy.calledOnce).to.be.true
			expect(response.data).to.deep.equal(expectedResponse)
		})

		it('Should throw error if service method throws one', async () => {
			// Arrange
			const productService = stubInterface<IProductService>()
			depContainer.bindConstant(T.PRODUCT_DIRECT_SVC, productService)
			depContainer.bindConstant(T.PRODUCT_MEDIATE_SVC, productService)
			const expectedError = new Error('AN_EXPECTED_ERROR')
			productService.create.throws(expectedError)

			const payload = {
				name: randomString(50),
				price: randomInt(0, 100e6),
				color: randomString(50),
				branchIds: randomBigInt(),
				categoryId: randomBigInt(),
				status: randomInt(0, 2),
			}

			await server.init()
			try {
				await axios.post(`${BASE_URL}`, payload)
				expect(true, 'Should not reach here').to.be.false
			}
			catch (err) {
				// Assert
				expect((err as AxiosError).response.status).to.equal(500)
			}
		})

	}) // describe 'create'

})
