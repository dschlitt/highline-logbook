import { db } from '$lib/db';

function rigDays(startDate: string, endDate?: string): number {
	const end = endDate ? Date.parse(endDate) : Date.now();
	return Math.max(Math.ceil(Math.abs(end - Date.parse(startDate)) / (1000 * 60 * 60 * 24)), 1);
}

/** Returns total days rigged for every webbing key ("name-lengthm#segment"), including backlog. */
export async function allWebbingDays(): Promise<{ [key: string]: number }> {
	const [webbings, rigs] = await Promise.all([db.webbing.toArray(), db.rig.toArray()]);

	const days: { [key: string]: number } = {};

	for (const w of webbings) {
		days[`${w.name}-${w.length}m#${w.segmentNumber}`] = w.backlogDays;
	}

	for (const rig of rigs) {
		const d = rigDays(rig.startDate, rig.endDate);
		for (const key of rig.webbings) {
			days[key] = (days[key] ?? 0) + d;
		}
	}

	return days;
}

/** Returns total days rigged for a single webbing key, including backlog. */
export async function webbingDaysById(webbingId: number): Promise<number> {
	const w = await db.webbing.get(webbingId);
	if (!w) return 0;
	const key = `${w.name}-${w.length}m#${w.segmentNumber}`;
	const map = await allWebbingDays();
	return map[key] ?? 0;
}
