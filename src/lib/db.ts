import Dexie, { type EntityTable, type Transaction } from 'dexie';

interface Webbing {
	id: number;
	name: string;
	segmentNumber: number;
	length: number;
	purchaseDate: string;
	backlogDays: number;
	notes: string;
}

const db = new Dexie('webbingLog') as Dexie & {
	webbing: EntityTable<Webbing, 'id'>
};

db.version(1).stores({
	webbing: 'id++'
});

const dummyData = [
	{
		name: 'y2k',
		segmentNumber: 1,
		length: 54,
		purchaseDate: '2022-03-13',
		backlogDays: 75,
		notes: 'Took to Colombia, gifted to Diego'
	},
	{
		name: 'y2k',
		segmentNumber: 2,
		length: 54,
		purchaseDate: '2022-03-13',
		backlogDays: 75,
		notes: 'Took to Colombia, gifted to Diego'
	},
	{
		name: 'y2k',
		segmentNumber: 3,
		length: 54,
		purchaseDate: '2022-03-13',
		backlogDays: 45,
		notes: ''
	},
	{
		name: 'y2k',
		segmentNumber: 4,
		length: 54,
		backlogDays: 45,
		purchaseDate: '2022-03-13',
		notes: ''
	},
	{
		name: 'y2k',
		length: 54,
		segmentNumber: 5,
		backlogDays: 45,
		purchaseDate: '2022-03-13',
		notes: ''
	},
	{
		name: 'Paradigm',
		segmentNumber: 1,
		length: '40',
		backlogDays: 45,
		purchaseDate: '2025-02-12',
		notes: ''
	},
	{
		name: 'Paradigm',
		segmentNumber: 2,
		length: '40',
		backlogDays: 45,
		purchaseDate: '2025-02-12',
		notes: ''
	},
	{
		name: 'silk99',
		segmentNumber: 1,
		length: '100',
		backlogDays: 47,
		purchaseDate: '2023-12-16',
		notes: ''
	},
	{
		name: 'silk99',
		segmentNumber: 2,
		length: '100',
		backlogDays: 47,
		purchaseDate: '2023-12-16',
		notes: ''
	},
	{
		name: 'silk99',
		segmentNumber: 3,
		length: '100',
		backlogDays: 47,
		purchaseDate: '2023-12-16',
		notes: ''
	},
	{
		name: 'silk99',
		segmentNumber: 4,
		length: '100',
		backlogDays: 47,
		purchaseDate: '2023-12-16',
		notes: ''
	},
	{
		name: 'silk99',
		segmentNumber: 5,
		length: '100',
		backlogDays: 47,
		purchaseDate: '2023-12-16',
		notes: ''
	},
];

db.on('populate', function(transaction: Transaction) {
	transaction.table('webbing').bulkAdd(dummyData);
});

db.open();

export { type Webbing }
export { db }
