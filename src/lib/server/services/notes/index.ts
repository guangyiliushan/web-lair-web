import type { NoteItem } from './types';

export async function listNotes(): Promise<NoteItem[]> {
	// TODO: Query from DB
	return [];
}

export async function getNoteById(id: string): Promise<NoteItem | null> {
	return null;
}

export async function createNote(): Promise<NoteItem> {
	throw new Error('Not implemented');
}

export async function updateNote(): Promise<NoteItem> {
	throw new Error('Not implemented');
}
