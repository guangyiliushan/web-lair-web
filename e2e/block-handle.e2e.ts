import { test, expect } from '@playwright/test';

test.describe('BlockHandleToolbar', () => {
	test('toolbar appears when hovering a block in the editor', async ({ page }) => {
		await page.goto('/admin/posts/edit');

		// Wait for the Lexical editor to be ready
		const editor = page.locator('[data-lexical-editor]');
		await expect(editor).toBeVisible({ timeout: 10000 });

		// Find the first block (direct child paragraph of the editor root)
		const firstBlock = editor.locator(':scope > :first-child');
		await expect(firstBlock).toBeVisible();

		// Hover over the first block
		await firstBlock.hover();

		// The block handle toolbar should appear (mounted to document.body)
		const toolbar = page.locator('[role="toolbar"][aria-label="Block actions"]');
		await expect(toolbar).toBeVisible({ timeout: 3000 });
	});

	test('add block button inserts a new paragraph after current block', async ({ page }) => {
		await page.goto('/admin/posts/edit');

		const editor = page.locator('[data-lexical-editor]');
		await expect(editor).toBeVisible({ timeout: 10000 });

		// Count initial blocks
		const initialBlockCount = await editor.locator(':scope > *').count();

		// Hover first block
		const firstBlock = editor.locator(':scope > :first-child');
		await firstBlock.hover();

		// Click the "+" add block button
		const addButton = page.locator('button[aria-label="Add block"]');
		await expect(addButton).toBeVisible({ timeout: 3000 });
		await addButton.click();

		// Should have one more block
		await expect(editor.locator(':scope > *')).toHaveCount(initialBlockCount + 1);
	});

	test('dropdown menu opens and contains all expected items', async ({ page }) => {
		await page.goto('/admin/posts/edit');

		const editor = page.locator('[data-lexical-editor]');
		await expect(editor).toBeVisible({ timeout: 10000 });

		// Hover first block
		const firstBlock = editor.locator(':scope > :first-child');
		await firstBlock.hover();

		// Click the grip-vertical button to open dropdown
		const gripButton = page.locator('button[aria-label="Block actions"]');
		await expect(gripButton).toBeVisible({ timeout: 3000 });
		await gripButton.click();

		// Verify dropdown menu appears
		const menu = page.locator('[data-slot="dropdown-menu-content"]');
		await expect(menu).toBeVisible({ timeout: 2000 });

		// Check TURN INTO section
		await expect(menu.getByText('TURN INTO')).toBeVisible();
		await expect(menu.getByText('Text')).toBeVisible();
		await expect(menu.getByText('Heading 1')).toBeVisible();

		// Check ACTIONS section
		await expect(menu.getByText('ACTIONS')).toBeVisible();
		await expect(menu.getByText('Duplicate')).toBeVisible();
		await expect(menu.getByText('Move Up')).toBeVisible();
		await expect(menu.getByText('Move Down')).toBeVisible();

		// Check Delete
		await expect(menu.getByText('Delete')).toBeVisible();
	});

	test('toolbar hides after mouse leaves the block', async ({ page }) => {
		await page.goto('/admin/posts/edit');

		const editor = page.locator('[data-lexical-editor]');
		await expect(editor).toBeVisible({ timeout: 10000 });

		const firstBlock = editor.locator(':scope > :first-child');
		await firstBlock.hover();

		// Wait for toolbar to appear
		const toolbar = page.locator('[role="toolbar"][aria-label="Block actions"]');
		await expect(toolbar).toBeVisible({ timeout: 3000 });

		// Move mouse to a different area
		await page.locator('header').first().hover();

		// Toolbar should eventually hide (with 300ms delay)
		await expect(toolbar).not.toBeVisible({ timeout: 2000 });
	});

	test('delete block removes it from the editor', async ({ page }) => {
		await page.goto('/admin/posts/edit');

		const editor = page.locator('[data-lexical-editor]');
		await expect(editor).toBeVisible({ timeout: 10000 });

		const initialBlockCount = await editor.locator(':scope > *').count();

		// Hover first block
		const firstBlock = editor.locator(':scope > :first-child');
		await firstBlock.hover();

		// Open the grip menu
		const gripButton = page.locator('button[aria-label="Block actions"]');
		await expect(gripButton).toBeVisible({ timeout: 3000 });
		await gripButton.click();

		// Click Delete
		const deleteItem = page.locator('[data-slot="dropdown-menu-content"]').getByText('Delete');
		await expect(deleteItem).toBeVisible();
		await deleteItem.click();

		// Should have one fewer block
		await expect(editor.locator(':scope > *')).toHaveCount(initialBlockCount - 1);
	});
});
