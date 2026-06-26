// TODO: Settings service for CRUD operations on site_setting
export async function getSiteSettings(): Promise<Record<string, unknown>> {
	return {};
}

export async function saveSiteSettings(group: string, values: Record<string, unknown>): Promise<void> {
	// TODO: Upsert into site_setting table
	throw new Error('Not implemented');
}
