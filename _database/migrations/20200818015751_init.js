const tables = require('../seeds/data/tables')


exports.up = async function(knex) {
	const WITHOUT_TIMEZONE = true
	const schema = knex.schema

	console.log('** Dropping tables **')
	await schema.dropTableIfExists(tables.PRODUCT_BRANCH)
	await schema.dropTableIfExists(tables.PRODUCTS)

	await Promise.all([
		schema.dropTableIfExists(tables.REQUEST_LOGS),
		schema.dropTableIfExists(tables.CATEGORIES),
		schema.dropTableIfExists(tables.BRANCHES),
	])

	console.log('** Creating tables **')
	await branches()
	await categories()
	await requestLogs()
	await products()
	await productBranch()


	async function branches() {
		await schema.createTable(tables.BRANCHES, tbl => {
			tbl.bigInteger('id').primary()
			tbl.string('name', 100).notNullable().index()
			tbl.timestamp('created_at', WITHOUT_TIMEZONE).notNullable()
			tbl.timestamp('updated_at', WITHOUT_TIMEZONE)
		})
	}

	async function categories() {
		await schema.createTable(tables.CATEGORIES, tbl => {
			tbl.bigInteger('id').primary()
			tbl.string('name', 100).notNullable().index()
			tbl.timestamp('created_at', WITHOUT_TIMEZONE).notNullable()
			tbl.timestamp('updated_at', WITHOUT_TIMEZONE)
		})
	}

	async function requestLogs() {
		await schema.createTable(tables.REQUEST_LOGS, tbl => {
			tbl.bigInteger('id').primary()
			tbl.string('operation_name', 50).notNullable().index()
			tbl.string('ip_address', 50).notNullable().index()
			tbl.string('device_name', 50).notNullable().index()
			tbl.jsonb('request_payload').notNullable().index()
			tbl.timestamp('created_at', WITHOUT_TIMEZONE).notNullable()
		})
	}

	async function products() {
		await schema.createTable(tables.PRODUCTS, tbl => {
			tbl.bigInteger('id').primary()

			tbl.string('name', 100).notNullable()
			tbl.float('price', 4).notNullable()
			tbl.string('color', 50).notNullable()
			tbl.specificType('status', 'smallint').defaultTo(1).notNullable()
			tbl.timestamp('created_at', WITHOUT_TIMEZONE).notNullable()
			tbl.timestamp('updated_at', WITHOUT_TIMEZONE)
			tbl.bigInteger('category_id')

			tbl.foreign('category_id')
				.references('id').inTable(tables.CATEGORIES)
				.onDelete('CASCADE')
		})

		await schema.raw(`ALTER TABLE public.${tables.PRODUCTS}` +
			` ADD CONSTRAINT ${tables.PRODUCTS}_status CHECK (status::smallint = ANY (ARRAY[0, 1, 2]))`)
	}

	async function productBranch() {
		await schema.createTable(tables.PRODUCT_BRANCH, tbl => {
			tbl.bigInteger('product_id')
			tbl.bigInteger('branch_id')
			tbl.primary(['product_id', 'branch_id'])

			tbl.foreign('product_id')
				.references('id').inTable(tables.PRODUCTS)
				.onDelete('CASCADE')

			tbl.foreign('branch_id')
				.references('id').inTable(tables.BRANCHES)
				.onDelete('CASCADE')
		})
	}

};

exports.down = function(knex) {
  
};
