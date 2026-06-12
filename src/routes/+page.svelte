<script lang="ts">
	import Hero from '$lib/components/home/Hero.svelte';
	import ActivityFeed from '$lib/components/home/ActivityFeed.svelte';
	import Timeline from '$lib/components/home/Timeline.svelte';
	import CategoryNav from '$lib/components/home/CategoryNav.svelte';
</script>

<Hero />

<div class="flex flex-col gap-24 py-16">
	<ActivityFeed />
	<Timeline />
	<CategoryNav />
</div>
