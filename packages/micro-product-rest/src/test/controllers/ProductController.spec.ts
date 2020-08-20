/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable prefer-arrow-callback */
import * as path from 'path'

import { expect } from 'chai'
import axios, { AxiosResponse, AxiosError, AxiosInstance } from 'axios'
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

import * as pdto from '../../app/contracts-product-management/dto/product'
import { IProductService } from '../../app/contracts-product-management/interfaces/IProductService'
import { DecodeAccessTokenResponse } from '../../app/contracts/dto/auth'
import { IAuthService } from '../../app/contracts/interfaces/IAuthService'
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
const ACCESS_TOKEN = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJkaXNwbGF5TmFtZSI6Ik5BQiBD'
	+ 'aGFsbGVuZ2UiLCJpYXQiOjE1OTc5MjU3NjIsImV4cCI6NDc1MzY4NTc2MiwianRpIjoiMTU5NzkyNTc2'
+ 'MjYzNyJ9.XK0Dhc49jqKK3QVGs3Smwr5GZ6pxQIXOVsc9s0evlKhcpBUE9ZXpJ7BPOC27NZmLe7SIxu0hVdLDnTC_LJddKw'


describe('ProductController', () => {

	let server: ExpressServerAddOn
	let depContainer: DependencyContainer
	let axiosInstance: AxiosInstance

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
		axiosInstance = axios.create({
			baseURL: BASE_URL,
			timeout: 1000,
			headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
		})

		const authSvc = stubInterface<IAuthService>()
		authSvc.decodeAccessToken.resolves(DecodeAccessTokenResponse.from(<DecodeAccessTokenResponse>{
			hasData: true,
			displayName: 'Unit test runner',
		}))
		depContainer.bindConstant(T.AUTH_SVC, authSvc)
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
				await axiosInstance.post('/', payload)
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

		it('Should respond with 401 status if request is not authorized', async () => {
			// Arrange
			const productService = stubInterface<IProductService>()
			depContainer.bindConstant(T.PRODUCT_DIRECT_SVC, productService)
			depContainer.bindConstant(T.PRODUCT_MEDIATE_SVC, productService)

			const payload = { // Invalid request payload
				name: randomString(2),
				price: randomInt(-100, -1),
				color: randomString(51),
				branchIds: '12Three45',
				status: randomInt(3, 10),
			}

			await server.init()
			try {
				await axios.post(BASE_URL, payload) // Use default axios instance
				expect(true, 'Should not reach here').to.be.false
			}
			catch (err) {
				// Assert: Unauthorize status code, not validation error
				expect((err as AxiosError).response.status).to.equal(401)
				expect((err as AxiosError).response.statusText).to.equal('Unauthorized')
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
			const expectedRequest = pdto.CreateProductRequest.from(payload)

			const productService = stubInterface<IProductService>()
			productService.create.resolves(new pdto.CreateProductResponse(false))
			depContainer.bindConstant(T.PRODUCT_DIRECT_SVC, productService)
			depContainer.bindConstant(T.PRODUCT_MEDIATE_SVC, productService)

			await server.init() // Web server starts listening
			const controller = depContainer.resolve<ProductController>(ProductController.name)
			const createSpy = sinon.spy(controller, 'create')

			// Act
			let response: AxiosResponse
			try {
				response = await axiosInstance.post('/', payload)
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
			const expectedResponse = pdto.CreateProductResponse.from({
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
				response = await axiosInstance.post('/', payload)
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
				await axiosInstance.post('/', payload)
				expect(true, 'Should not reach here').to.be.false
			}
			catch (err) {
				// Assert
				expect((err as AxiosError).response.status).to.equal(500)
			}
		})

	}) // describe 'create'

})
