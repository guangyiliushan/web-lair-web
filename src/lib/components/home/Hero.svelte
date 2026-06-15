<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { m } from '$lib/paraglide/messages';
	import { IconBrandGithub, IconBrandTwitter, IconMail, IconRss, IconBrandTelegram, IconBrandX, IconChevronDown } from '@tabler/icons-svelte';
</script>

<section class="relative min-h-[calc(100vh-6rem)] flex flex-col items-center justify-center overflow-hidden px-4">
	<div class="container w-full max-w-5xl flex flex-col-reverse md:flex-row items-center justify-between gap-12 z-10">
		<div class="flex-1 flex flex-col items-start">
			<h1 class="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4">
				{m.hero_title()}
			</h1>

			<h2 class="text-2xl sm:text-3xl md:text-4xl font-semibold mb-6">
				A NodeJS Full Stack
				<span class="font-mono text-primary">&lt;Developer /&gt;</span>
			</h2>

			<p class="text-muted-foreground text-lg mb-10 max-w-lg">
				{m.hero_description()}
			</p>

			<div class="flex flex-wrap items-center gap-3">
				<Button variant="ghost" size="icon" class="size-10 rounded-full" aria-label="GitHub">
					<IconBrandGithub />
				</Button>
				<Button variant="ghost" size="icon" class="size-10 rounded-full" aria-label="Twitter">
					<IconBrandTwitter />
				</Button>
				<Button variant="ghost" size="icon" class="size-10 rounded-full" aria-label="Email">
					<IconMail />
				</Button>
				<Button variant="ghost" size="icon" class="size-10 rounded-full" href="/rss.xml" aria-label="RSS Feed">
					<IconRss />
				</Button>
				<Button variant="ghost" size="icon" class="size-10 rounded-full" aria-label="Telegram">
					<IconBrandTelegram />
				</Button>
				<Button variant="ghost" size="icon" class="size-10 rounded-full" aria-label="X">
					<IconBrandX />
				</Button>
			</div>
		</div>

		<div class="relative shrink-0 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96">
			<div class="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/20 to-secondary/20 blur-3xl animate-pulse"></div>
			<div class="relative w-full h-full rounded-full overflow-hidden border-4 border-background shadow-2xl">
				<img
					src="https://api.dicebear.com/10.x/lorelei/svg?flip=horizontal&seed=guangyiliushan"
					alt="Avatar"
					class="w-full h-full object-cover"
					loading="lazy"
				/>
			</div>
		</div>
	</div>

	<div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-muted-foreground animate-bounce">
		<p class="text-xs sm:text-sm text-center max-w-xs">
			{m.hero_welcome()}
		</p>
		<IconChevronDown class="size-5" />
	</div>
</section>
