<script lang="ts">
	import { cn } from '$lib/utils';
	import { m } from '$lib/paraglide/messages';
	import { page } from '$app/state';
	import { IconCodeCircle2, IconMenu2, IconX, IconChevronDown } from '@tabler/icons-svelte-runes';
	import ThemeToggle from '$lib/components/layout/ThemeToggle.svelte';
	import LangSwitcher from '$lib/components/layout/LangSwitcher.svelte';
	import UserNav from '$lib/components/layout/UserNav.svelte';
	import { Separator } from '$lib/components/ui/separator';
	import NavMegaMenu from '$lib/components/layout/NavMegaMenu.svelte';
	import { navigationConfig } from '$lib/config/navigation.config';

	// ── Types ──
	type AuthData = {
		user: { id: string; name: string; email: string; emailVerified: boolean; image: string | null } | null;
		profile: { displayName: string; avatarUrl: string | null } | null;
	} | null;

	// ── Props ──
	let { auth }: { auth?: AuthData } = $props();

	// ── Derived ──
	const currentPath = $derived(page.url.pathname);

	function isActive(path: string): boolean {
		if (path === '/') return currentPath === '/' || !currentPath.startsWith('/en');
		return currentPath.startsWith(path);
	}

	// ── Mobile menu state ──
	let menuOpen = $state(false);
	let expandedKey = $state<string | null>(null);

	function toggleMenu() { menuOpen = !menuOpen; }
	function closeMenu() { menuOpen = false; expandedKey = null; }
	function toggleExpanded(key: string) { expandedKey = expandedKey === key ? null : key; }
</script>

<header class="pointer-events-none fixed top-6 right-0 left-0 z-50 flex justify-center px-4">
	<!-- Single cohesive card: rounded-full when closed, rounded-3xl when open -->
	<div
		class="pointer-events-auto w-full max-w-5xl overflow-hidden border bg-background/70 shadow-sm backdrop-blur-md transition-all duration-300"
		class:rounded-3xl={menuOpen}
		class:rounded-full={!menuOpen}
	>
		<!-- ══�?Top bar (always visible) ══�?-->
		<div class="flex items-center justify-between px-4 py-2">
			<!-- Logo -->
			<a href="/" class="flex shrink-0 items-center gap-2 font-bold">
				<IconCodeCircle2 class="size-6 text-primary" />
				<span class="hidden sm:inline">Lair</span>
			</a>

			<!-- Desktop nav: mega menu hover (lg+) -->
			<nav class="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
				{#each navigationConfig as item (item.key)}
					{#if item.megaMenu}
						<NavMegaMenu menu={item.megaMenu} delay={150}>
							{#snippet trigger()}
								<a
									href={item.href}
									class={cn(
										'rounded-full px-4 py-1.5 text-sm font-medium transition-colors hover:text-primary',
										isActive(item.href) ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
									)}
								>
									{item.label}
								</a>
							{/snippet}
						</NavMegaMenu>
					{:else}
						<a
							href={item.href}
							class={cn(
								'rounded-full px-4 py-1.5 text-sm font-medium transition-colors hover:text-primary',
								isActive(item.href) ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
							)}
						>
							{item.label}
						</a>
					{/if}
				{/each}
			</nav>

			<!-- Right controls -->
			<div class="flex items-center gap-1">
				<!-- Desktop: all inline -->
				<div class="hidden items-center gap-2 lg:flex">
					<LangSwitcher />
					<ThemeToggle />
					<UserNav {auth} />
				</div>

				<!-- Mobile: lang + theme + menu toggle -->
				<div class="flex items-center gap-1 lg:hidden">
					<LangSwitcher />
					<ThemeToggle />
					<button
						onclick={toggleMenu}
						aria-expanded={menuOpen}
						aria-label={menuOpen ? m.close_menu() : m.open_menu()}
						class="inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
					>
						{#if menuOpen}
							<IconX class="size-5" data-icon="inline-start" />
						{:else}
							<IconMenu2 class="size-5" data-icon="inline-start" />
						{/if}
					</button>
				</div>
			</div>
		</div>

		<!-- ══�?Expandable menu (mobile only) ══�?-->
		{#if menuOpen}
			<div>
				<Separator class="mx-4" />

				<div class="px-5 pb-5 pt-6">
					<nav class="max-h-[70svh] overflow-y-auto" aria-label="Mobile navigation">
						<div class="flex flex-col">
							{#each navigationConfig as item (item.key)}
								<div>
									<!-- Top-level: click to expand accordion (if has children), else direct link -->
									{#if item.children && item.children.length > 0}
										<button
											onclick={() => toggleExpanded(item.key)}
											class="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors text-muted-foreground hover:bg-muted/50 hover:text-foreground"
										>
											<span>{item.label}</span>
											<IconChevronDown
											class={cn('size-4 transition-transform duration-200', expandedKey === item.key && 'rotate-180')}
											/>
										</button>
										{#if expandedKey === item.key}
											<div class="ml-3 flex flex-col border-l pb-1 pl-3 pt-0.5">
												{#each item.children as child (child.href)}
													<a
														href={child.href}
														onclick={closeMenu}
														class="flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors text-muted-foreground hover:bg-muted/50 hover:text-foreground"
													>
														<span>{child.label}</span>
														{#if child.badge}
															<span class="text-xs text-muted-foreground">{child.badge}</span>
														{/if}
													</a>
												{/each}
											</div>
										{/if}
									{:else}
										<a
											href={item.href}
											onclick={closeMenu}
											class={cn(
												'flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
												isActive(item.href)
													? 'bg-primary/10 text-primary'
													: 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
											)}
										>
											{item.label}
										</a>
									{/if}
								</div>
							{/each}
						</div>
					</nav>

					<!-- Bottom: user section -->
					<Separator class="mt-4" />
					<div class="pt-4">
						{#if auth?.user}
							<div class="flex items-center gap-3">
								<div class="flex size-9 items-center justify-center rounded-full bg-muted text-sm font-medium">
									{auth.profile?.displayName?.charAt(0) ??
										auth.user.name?.charAt(0) ?? '?'}
								</div>
								<div class="min-w-0 flex-1">
									<p class="truncate text-sm font-medium">
										{auth.profile?.displayName ?? auth.user.name}
									</p>
									<p class="truncate text-xs text-muted-foreground">
										{auth.user.email}
									</p>
								</div>
							</div>
							<div class="mt-3 flex flex-col gap-0.5">
								<a
									href="/dashboard"
									onclick={closeMenu}
									class="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
								>
									{m.nav_dashboard()}
								</a>
								<a
									href="/account"
									onclick={closeMenu}
									class="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
								>
									{m.nav_account()}
								</a>
							</div>
						{:else}
							<a
								href="/login?redirectTo={encodeURIComponent(page.url.pathname + page.url.search)}"
								onclick={closeMenu}								class="flex items-center justify-center rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted/50"
							>
								{m.nav_sign_in()}
							</a>
						{/if}
					</div>
				</div>
			</div>
		{/if}
	</div>
</header>
