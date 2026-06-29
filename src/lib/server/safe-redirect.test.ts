import { describe, it, expect } from 'vitest';
import { safeRedirect } from './safe-redirect';

describe('safeRedirect', () => {
	it('returns the fallback for null', () => {
		expect(safeRedirect(null)).toBe('/admin');
	});

	it('returns the fallback for undefined', () => {
		expect(safeRedirect(undefined)).toBe('/admin');
	});

	it('returns the fallback for an empty string', () => {
		expect(safeRedirect('')).toBe('/admin');
	});

	it('returns the fallback for a custom fallback', () => {
		expect(safeRedirect(null, '/home')).toBe('/home');
	});

	it('returns a valid relative path', () => {
		expect(safeRedirect('/admin')).toBe('/admin');
	});

	it('returns a valid relative path with query string', () => {
		expect(safeRedirect('/posts/abc?q=1')).toBe('/posts/abc?q=1');
	});

	it('rejects a path outside the allowed prefix', () => {
		expect(safeRedirect('/settings', '/admin', { allowedPrefix: '/admin' })).toBe('/admin');
	});

	it('accepts a path inside the allowed prefix', () => {
		expect(safeRedirect('/admin/posts/new', '/admin', { allowedPrefix: '/admin' })).toBe(
			'/admin/posts/new'
		);
	});

	it('rejects an absolute http URL', () => {
		expect(safeRedirect('https://evil.com')).toBe('/admin');
	});

	it('rejects an absolute http URL with path', () => {
		expect(safeRedirect('http://evil.com/phish')).toBe('/admin');
	});

	it('rejects a protocol-relative URL', () => {
		expect(safeRedirect('//evil.com')).toBe('/admin');
	});

	it('rejects a protocol-relative URL with path', () => {
		expect(safeRedirect('//evil.com/phish')).toBe('/admin');
	});

	it('rejects a backslash-prefixed URL', () => {
		expect(safeRedirect('\\evil.com')).toBe('/admin');
	});

	it('rejects a relative path containing double slashes', () => {
		expect(safeRedirect('/a//b')).toBe('/admin');
	});
});
