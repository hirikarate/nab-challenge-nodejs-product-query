const moment = require('moment')
const { IdGenerator } = require('@micro-fleet/id-generator')

const categories = require('./categories')
const createdAt = moment.utc().format()


const idGen = new IdGenerator()

// Source: https://www.bikesales.com.au/bikes/
const MOTORBIKES = [
	{
		id: idGen.nextBigInt(),
		name: '1996 Honda CR125R - Dirt',
		color: 'Red, Orange, White',
		price: 6150,
		categoryId: categories[0].id,
		createdAt,
	},
	{
		id: idGen.nextBigInt(),
		name: '1979 Honda CR250R - Dirt',
		color: 'All red',
		price: 7000,
		categoryId: categories[0].id,
		createdAt,
	},
	{
		id: idGen.nextBigInt(),
		name: '1984 Yamaha IT490 - Dirt',
		color: 'Cyan/Blue, yellow',
		price: 6000,
		categoryId: categories[0].id,
		createdAt,
	},
	{
		id: idGen.nextBigInt(),
		name: '2020 Suzuki DR200S - Dirt',
		color: 'Robotic black',
		price: 5990,
		categoryId: categories[0].id,
		createdAt,
	},
	{
		id: idGen.nextBigInt(),
		name: '2019 Piaggio Medley 150 S - Scooter',
		color: 'Dark blue, gray',
		price: 5990,
		categoryId: categories[0].id,
		createdAt,
	},
	{
		id: idGen.nextBigInt(),
		name: '2019 Yamaha XMAX 300 - Scooter',
		color: 'Dark brown, silver',
		price: 8499,
		categoryId: categories[0].id,
		createdAt,
	},
	{
		id: idGen.nextBigInt(),
		name: '2016 Honda Super Cub - Scooter',
		color: 'A little red, a little white',
		price: 2490,
		categoryId: categories[0].id,
		createdAt,
	},
	{
		id: idGen.nextBigInt(),
		name: '2017 Yamaha Bolt (XVS950CU) MY15 - Cruiser',
		color: 'Shiny Black',
		price: 9990,
		categoryId: categories[0].id,
		createdAt,
	},
	{
		id: idGen.nextBigInt(),
		name: '2005 Honda VTX1800C - Cruiser',
		color: 'Dark red, Shiny silver',
		price: 9990,
		categoryId: categories[0].id,
		createdAt,
	},
	{
		id: idGen.nextBigInt(),
		name: '2007 Suzuki Hayabusa (GSX1300R) - Super sport',
		color: 'Major blue, little black',
		price: 13000,
		categoryId: categories[0].id,
		createdAt,
	},
]

// Source: https://www.bikeexchange.com.au/
const BICYCLES = [
	{
		id: idGen.nextBigInt(),
		name: 'Whyte Wessex 2020 - Road',
		color: 'Gray, silver',
		price: 2850,
		categoryId: categories[1].id,
		createdAt,
	},
	{
		id: idGen.nextBigInt(),
		name: 'BMC 21 Roadmachine One - Road',
		color: 'Orange, silver',
		price: 6976,
		categoryId: categories[1].id,
		createdAt,
	},
	{
		id: idGen.nextBigInt(),
		name: '2021 BMC Roadmachine 01 FOUR - Road',
		color: 'All black, orange decals',
		price: 9799,
		categoryId: categories[1].id,
		createdAt,
	},
	{
		id: idGen.nextBigInt(),
		name: 'Cervelo C3 Disc Ultegra 2020 - Road',
		color: 'Red, blue, white',
		price: 4195,
		categoryId: categories[1].id,
		createdAt,
	},
	{
		id: idGen.nextBigInt(),
		name: 'Cervelo Top Fuel 9.8 2020 - Mountain',
		color: 'Red, blue, white',
		price: 4195,
		categoryId: categories[1].id,
		createdAt,
	},
	{
		id: idGen.nextBigInt(),
		name: 'BMC Norco SIGHT A1 - Mountain',
		color: 'Green, yellow',
		price: 6089,
		categoryId: categories[1].id,
		createdAt,
	},
	{
		id: idGen.nextBigInt(),
		name: 'Orbea RALLON M20 160 - Mountain',
		color: 'Dark Green, very little yellow',
		price: 6990,
		categoryId: categories[1].id,
		createdAt,
	},
	{
		id: idGen.nextBigInt(),
		name: 'Liv Tempt 2 2020 - Mountain',
		color: 'Violet',
		price: 999,
		categoryId: categories[1].id,
		createdAt,
	},
	{
		id: idGen.nextBigInt(),
		name: 'BMC Equinox TTX 9.9 Carbon - Racing',
		color: 'Orange',
		price: 3500,
		categoryId: categories[1].id,
		createdAt,
	},
	{
		id: idGen.nextBigInt(),
		name: 'Cervelo P2 Rim 105 5700 2019 - Racing',
		color: 'Lime, black',
		price: 3300,
		categoryId: categories[1].id,
		createdAt,
	},
]

module.exports = [
	...MOTORBIKES,
	...BICYCLES,
]