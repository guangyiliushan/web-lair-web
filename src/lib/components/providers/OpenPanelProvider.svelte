<script lang="ts">
	/**
	 * OpenPanel provider — initializes OpenPanel tracking script in the browser only.
	 * Reads from PUBLIC_ environment variables.
	 */
	import { onMount } from 'svelte';
	import type { Snippet } from 'svelte';
	import { browser } from '$app/environment';
	import { env } from '$env/dynamic/public';

	let { children }: { children: Snippet } = $props();
	let initialized = $state(false);

	onMount(() => {
		if (!browser || initialized) return;

		const enabled = env.PUBLIC_OPENPANEL_ENABLED === 'true';
		const apiUrl = env.PUBLIC_OPENPANEL_API_URL;
		const clientId = env.PUBLIC_OPENPANEL_CLIENT_ID;

		if (!enabled || !apiUrl || !clientId) return;

		// TODO: Initialize OpenPanel SDK or inject script tag
		// window.op?.('init', { apiUrl, clientId, trackScreenViews: true, trackOutgoingLinks: true });
		initialized = true;
	});
</script>

{@render children?.()}
