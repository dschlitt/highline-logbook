import Dexie, { type EntityTable, type Transaction } from 'dexie';

interface Webbing {
	id?: number;
	name: string;
	segmentNumber: string; // TODO: Change to segmentId?
	length: number;
	purchaseDate: string;
	backlogDays: number;
	notes: string;
}

interface Rig {
	id?: number;
	name: string;
	webbings: string[];
	startDate: string;
	endDate?: string;
	up: number;
}

const db = new Dexie('webbingLog') as Dexie & {
	webbing: EntityTable<Webbing, 'id'>
	rig: EntityTable<Rig, 'id'>
};

// Explore compound keys for webbings for searching on names
db.version(1).stores({
	webbing: 'id++',
	rig: 'id++, *webbings, up'
});

const dummyWebbings: Webbing[] = [
	{
		name: 'y2k',
		length: 54,
		segmentNumber: '1',
		purchaseDate: '2022-03-13',
		backlogDays: 75,
		notes: 'Took to Colombia, gifted to Diego'
	},
	{
		name: 'y2k',
		length: 54,
		segmentNumber: '2',
		purchaseDate: '2022-03-13',
		backlogDays: 75,
		notes: 'Took to Colombia, gifted to Diego'
	},
	{
		name: 'y2k',
		length: 54,
		segmentNumber: '3',
		purchaseDate: '2022-03-13',
		backlogDays: 45,
		notes: ''
	},
	{
		name: 'y2k',
		length: 54,
		segmentNumber: '4',
		backlogDays: 45,
		purchaseDate: '2022-03-13',
		notes: ''
	},
	{
		name: 'y2k',
		length: 54,
		segmentNumber: '5',
		backlogDays: 45,
		purchaseDate: '2022-03-13',
		notes: ''
	},
	{
		name: 'Paradigm',
		length: 40,
		segmentNumber: '1',
		backlogDays: 45,
		purchaseDate: '2025-02-12',
		notes: ''
	},
	{
		name: 'Paradigm',
		length: 40,
		segmentNumber: '2',
		backlogDays: 45,
		purchaseDate: '2025-02-12',
		notes: ''
	},
	{
		name: 'TrickZone',
		length: 6,
		segmentNumber: '1',
		backlogDays: 0,
		purchaseDate: '2025-02-12',
		notes: ''
	},
	{
		name: 'silk99',
		length: 50,
		segmentNumber: '1',
		backlogDays: 0,
		purchaseDate: '2025-05-20',
		notes: ''
	},
	{
		name: 'silk99',
		length: 50,
		segmentNumber: '2',
		backlogDays: 0,
		purchaseDate: '2025-05-20',
		notes: ''
	},
	{
		name: 'silk99',
		length: 100,
		segmentNumber: '1',
		backlogDays: 47,
		purchaseDate: '2023-12-16',
		notes: ''
	},
	{
		name: 'silk99',
		length: 100,
		segmentNumber: '2',
		backlogDays: 47,
		purchaseDate: '2023-12-16',
		notes: ''
	},
	{
		name: 'silk99',
		length: 100,
		segmentNumber: '3',
		backlogDays: 47,
		purchaseDate: '2023-12-16',
		notes: ''
	},
	{
		name: 'silk99',
		length: 100,
		segmentNumber: '4',
		backlogDays: 47,
		purchaseDate: '2023-12-16',
		notes: ''
	},
	{
		name: 'silk99',
		length: 100,
		segmentNumber: '5',
		backlogDays: 47,
		purchaseDate: '2023-12-16',
		notes: ''
	},
];

const dummyRigs: Rig[] = [
	{
		name: 'Absurdian 3k',
		webbings: ['silk99-100m#1', 'silk99-100m#2'],
		startDate: '2024-10-25',
		endDate: '2024-10-26',
		up: 0
	},
	{
		name: 'PermaRig',
		webbings: ['Paradigm-40m#1', 'Paradigm-40m#2', 'ss99-50m#1', 'ss99-50m#2', 'TrickZone-6m#1'],
		startDate: '2025-05-20',
		up: 1
	},
];


db.on('populate', function(transaction: Transaction) {
	transaction.table('webbing').bulkAdd(dummyWebbings);
	transaction.table('rig').bulkAdd(dummyRigs);
});

db.open(); // TODO: When is this closed

export { type Webbing, type Rig }
export { db }
