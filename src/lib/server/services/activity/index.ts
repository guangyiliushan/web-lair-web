// TODO: Activity service for ProcessReporter ingestion and timeline

export interface ActivityEvent {
	id: string;
	source: string;
	type: string;
	title: string;
	payload: unknown;
	createdAt: Date;
}

export async function ingestEvent(event: Omit<ActivityEvent, 'id' | 'createdAt'>): Promise<ActivityEvent> {
	throw new Error('Not implemented');
}

export async function listRecentActivity(limit = 10): Promise<ActivityEvent[]> {
	return [];
}
