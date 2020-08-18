/* eslint-disable prefer-arrow-callback */
import * as path from 'path'

import { expect } from 'chai'
import axios, { AxiosResponse, AxiosError } from 'axios'
import { DependencyContainer, serviceContext, constants } from '@micro-fleet/common'
import {
	ExpressServerAddOn,
	ControllerCreationStrategy,
	ErrorHandlerFilter,
} from '@micro-fleet/web'

import * as dto from '../../app/contracts-product-management/dto/product'
import { createExpressMockServer } from '../shared/mock-web-addon'


const { Action } = dto
const PORT = 31000
const BASE_URL = `http://localhost:${PORT}/${dto.MODULE_NAME}`

describe('ProductController', function () {
	// this.timeout(60000) // For debugging

	let server: ExpressServerAddOn
	let depContainer: DependencyContainer

	function createServer(configs: object = {}): ExpressServerAddOn {
		({ server, depContainer } = createExpressMockServer({ configs }))
		serviceContext.setDependencyContainer(depContainer)
		server.controllerCreation = ControllerCreationStrategy.SINGLETON
		server.controllerPath = path.resolve(__dirname, '../../app/controllers/direct-controllers')
		return server
	}


	beforeEach(() => {
		server = createServer({
			[constants.Web.WEB_PORT]: PORT,
		})
		server.addGlobalErrorHandler(ErrorHandlerFilter)
	})

	afterEach(async () => {
		depContainer.dispose()
		await server.dispose()
		depContainer = server = null
		serviceContext.setDependencyContainer(null)
	})

	describe(Action.GET_BY_ID, () => {
		it('Should respond with validation error', (done: Function) => {
			// Arrange
			const request: Partial<dto.GetProductByIdRequest> = {
				// id: '', // Missing
				fields: ['unknows'], // Unknown field name
			}
			let error: any
			server.init()
				.then(() => axios.post(`${BASE_URL}/${Action.GET_BY_ID}`, request))
				.then((_response: AxiosResponse) => {
					// Expected Assert
					// const controller: any = depContainer.resolve(CONTROLLER_NAME)
					// expect(controller['spyFn']).to.be.called.once
					// expect(controller['spyFn']).to.be.called.with.
					// exactly('SampleModel', request.name, request.age,
					// request.position)
					expect(true, 'Should not reach here').to.be.false
				})
				.catch((err: AxiosError) => {
					console.error(error = err)
					expect(err.response?.status).to.equal(423)
				})
				.finally(() => done(error))
		})
	})

})
