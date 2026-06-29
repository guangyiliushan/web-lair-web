export function match(param: string): boolean {
	return /^[a-z0-9-]{6,64}$/.test(param);
}
