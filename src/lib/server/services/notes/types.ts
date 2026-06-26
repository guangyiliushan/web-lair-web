// TODO: Define Note types
export interface NoteItem {
	id: string;
	title: string;
	slug: string;
	content: string;
	status: 'draft' | 'published';
	seriesId: string | null;
	createdAt: Date;
	updatedAt: Date;
}
