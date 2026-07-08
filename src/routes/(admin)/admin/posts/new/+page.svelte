<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';
	import * as Card from '$lib/components/ui/card';
	import * as Field from '$lib/components/ui/field';
	import * as Select from '$lib/components/ui/select';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { MarkdownEditor } from '$lib/components/markdown';
	import IconDeviceFloppy from '@tabler/icons-svelte-runes/icons/device-floppy';
	import IconEye from '@tabler/icons-svelte-runes/icons/eye';
	import IconCategory from '@tabler/icons-svelte-runes/icons/category';
	import IconTag from '@tabler/icons-svelte-runes/icons/tag';
	import IconFileDescription from '@tabler/icons-svelte-runes/icons/file-description';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let title = $state('');
	let slug = $state('');
	let categoryId = $state('');
	let summary = $state('');
	let tags = $state('');
	let contentMarkdown = $state('');

	// Sync state when form returns with validation errors
	$effect(() => {
		const v = form?.values;
		if (v) {
			title = v.title ?? '';
			slug = v.slug ?? '';
			categoryId = v.categoryId ?? '';
			summary = v.summary ?? '';
			tags = v.tags ?? '';
			contentMarkdown = v.content ?? '';
		}
	});

	// Auto-generate slug from title
	function onTitleInput(e: Event) {
		const input = e.currentTarget as HTMLInputElement;
		title = input.value;
		if (!form?.values?.slug) {
			slug = title
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, '-')
				.replace(/^-|-$/g, '');
		}
	}
</script>

<svelte:head>
	<title>New Post - Lair Admin</title>
</svelte:head>

<form
	method="POST"
	use:enhance
	class="flex flex-col gap-6"
>
	<!-- Page Header -->
	<div class="flex flex-col gap-1">
		<h2 class="text-2xl font-semibold tracking-tight">Create post</h2>
		<p class="text-sm text-muted-foreground">Write a new Markdown article with rich editing.</p>
	</div>

	<!-- Main Editor Card -->
	<Card.Root>
		<Card.Content class="flex flex-col gap-6 pt-6">
			<Field.FieldGroup>
				<!-- Title -->
				<Field.Field data-invalid={form?.errors?.title ? true : undefined}>
					<Field.FieldLabel for="title">Title</Field.FieldLabel>
					<Input
						id="title"
						name="title"
						placeholder="Enter post title"
						value={title}
						oninput={onTitleInput}
						aria-invalid={form?.errors?.title ? true : undefined}
					/>
					{#if form?.errors?.title}
						<Field.FieldError>{form.errors.title}</Field.FieldError>
					{/if}
				</Field.Field>

				<!-- Slug -->
				<Field.Field data-invalid={form?.errors?.slug ? true : undefined}>
					<Field.FieldLabel for="slug">Slug</Field.FieldLabel>
					<Input
						id="slug"
						name="slug"
						placeholder="post-url-slug"
						bind:value={slug}
						aria-invalid={form?.errors?.slug ? true : undefined}
					/>
					<Field.FieldDescription>
						URL-friendly identifier: lowercase letters, numbers, and hyphens.
					</Field.FieldDescription>
					{#if form?.errors?.slug}
						<Field.FieldError>{form.errors.slug}</Field.FieldError>
					{/if}
				</Field.Field>

				<!-- Category + Tags row -->
				<div class="flex flex-col gap-4 sm:flex-row">
					<Field.Field class="flex-1" data-invalid={form?.errors?.categoryId ? true : undefined}>
						<Field.FieldLabel for="categoryId">
							<IconCategory data-icon="inline-start" />
							Category
						</Field.FieldLabel>
						<Select.Root type="single" name="categoryId" bind:value={categoryId as never}>
							<Select.Trigger aria-invalid={form?.errors?.categoryId ? true : undefined}>
								{categoryId
									? data.categories.find((c) => c.id === categoryId)?.name ?? 'Select a category'
									: 'Select a category'}
							</Select.Trigger>
							<Select.Portal>
								<Select.Content>
									<Select.Group>
										<Select.Label>Categories</Select.Label>
										{#each data.categories as cat (cat.id)}
											<Select.Item value={cat.id}>{cat.name}</Select.Item>
										{/each}
									</Select.Group>
								</Select.Content>
							</Select.Portal>
						</Select.Root>
						{#if form?.errors?.categoryId}
							<Field.FieldError>{form.errors.categoryId}</Field.FieldError>
						{/if}
					</Field.Field>

					<Field.Field class="flex-1">
						<Field.FieldLabel for="tags">
							<IconTag data-icon="inline-start" />
							Tags
						</Field.FieldLabel>
						<Input
							id="tags"
							name="tags"
							placeholder="svelte, typescript, tutorial"
							bind:value={tags}
						/>
						<Field.FieldDescription>
							Comma-separated tag names.
						</Field.FieldDescription>
					</Field.Field>
				</div>

				<!-- Summary -->
				<Field.Field>
					<Field.FieldLabel for="summary">
						<IconFileDescription data-icon="inline-start" />
						Summary
					</Field.FieldLabel>
					<Textarea
						id="summary"
						name="summary"
						placeholder="A brief excerpt or description..."
						bind:value={summary}
						rows={3}
					/>
				</Field.Field>
			</Field.FieldGroup>

			<Separator />

			<!-- Content Editor -->
			<Field.Field data-invalid={form?.errors?.content ? true : undefined}>
				<Field.FieldLabel for="content">Content</Field.FieldLabel>
				<Field.FieldDescription>
					Write your post in Markdown. Use the toolbar for formatting, or type Markdown directly.
				</Field.FieldDescription>
				<MarkdownEditor
					initialMarkdown={contentMarkdown}
					placeholder="Start writing your masterpiece..."
					showPreview={true}
					onChange={(detail) => {
						contentMarkdown = detail.markdown;
					}}
				/>
				<input type="hidden" name="content" value={contentMarkdown} />
				{#if form?.errors?.content}
					<Field.FieldError>{form.errors.content}</Field.FieldError>
				{/if}
			</Field.Field>
		</Card.Content>

		<Separator />

		<!-- Footer Actions -->
		<Card.Footer class="flex flex-row items-center gap-3">
			<Button type="submit">
				<IconDeviceFloppy data-icon="inline-start" />
				Publish
			</Button>
			<Button type="submit" variant="outline" name="isPublished" value="false">
				<IconDeviceFloppy data-icon="inline-start" />
				Save as draft
			</Button>
			<div class="flex-1"></div>
			<Button type="submit" variant="ghost" name="isPublished" value={String(form?.values?.isPublished ?? true)} disabled>
				<IconEye data-icon="inline-start" />
				Preview
			</Button>
		</Card.Footer>
	</Card.Root>
</form>
