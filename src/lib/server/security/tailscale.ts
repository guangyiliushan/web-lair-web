import { getRequestEvent } from '$app/server';
import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

/**
 * Tailscale assigns IPs from the CGNAT range 100.64.0.0/10.
 * https://tailscale.com/kb/1015/100.x-addresses
 */
const TAILSCALE_CIDR = { start: ip4ToInt('100.64.0.0'), end: ip4ToInt('100.127.255.255') };

const LOCALHOST_IPS = new Set(['127.0.0.1', '::1', '::ffff:127.0.0.1']);

function ip4ToInt(ip: string): number {
	return ip.split('.').reduce((acc, octet) => (acc << 8) + Number(octet), 0) >>> 0;
}

function isTailscaleIp(ip: string): boolean {
	if (LOCALHOST_IPS.has(ip)) {
		return true;
	}

	// IPv6-mapped IPv4 — extract the v4 part
	const v4 = ip.startsWith('::ffff:') ? ip.slice(7) : ip;
	const parts = v4.split('.');
	if (parts.length !== 4) {
		return false;
	}

	const int = ip4ToInt(v4);
	return int >= TAILSCALE_CIDR.start && int <= TAILSCALE_CIDR.end;
}

function getClientIp(): string {
	try {
		const event = getRequestEvent();
		if (!event) return '';

		// Prefer X-Real-IP if set by a trusted reverse proxy (e.g. Caddy/Nginx behind Tailscale)
		const realIp = event.request.headers.get('x-real-ip');
		if (realIp) return realIp.trim();

		// Fall back to SvelteKit's built-in client address
		return event.getClientAddress();
	} catch {
		return '';
	}
}

/**
 * Returns true when the current request originates from a Tailscale network node (or localhost).
 * In dev mode with DEV_ADMIN_BYPASS, always returns true.
 */
export function isTailscaleRequest(): boolean {
	if (env.DEV_ADMIN_BYPASS === 'true') {
		return true;
	}

	const ip = getClientIp();
	return isTailscaleIp(ip);
}

/**
 * Redirects to / (homepage) when the request is NOT from Tailscale.
 * Call this in admin page loads/actions before any other logic.
 */
export function requireTailscaleNetwork(): void {
	if (!isTailscaleRequest()) {
		redirect(303, '/');
	}
}
