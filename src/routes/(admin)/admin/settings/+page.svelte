<script lang="ts">
	import { Empty } from '$lib/components/ui/empty';
	import IconSettings from '@tabler/icons-svelte-runes/icons/settings';
</script>

<div class="flex flex-1 items-center justify-center">
	<Empty>
		<div class="flex flex-col items-center gap-1">
			<IconSettings class="size-8 text-muted-foreground/40" />
			<h3 class="text-lg font-semibold tracking-tight">设定</h3>
			<p class="text-sm text-muted-foreground">从左侧选择一个设定分类查看详情</p>
		</div>
	</Empty>
</div>
