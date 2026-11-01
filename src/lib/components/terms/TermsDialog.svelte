<script lang="ts">
	import Icon from '@iconify/svelte';
	import { Button } from '$lib/components/ui/button';
	import { Checkbox } from '$lib/components/ui/checkbox';

	let {
		show = $bindable(false),
		onAccept,
	}: {
		show: boolean;
		onAccept: () => void;
	} = $props();

	let checked = $state(false);
</script>

{#if show}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
		<div class="bg-card border rounded-xl shadow-2xl w-full max-w-sm mx-4 p-6 space-y-5 text-center" onclick={(e) => e.stopPropagation()}>
			<div class="size-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
				<Icon icon="mdi:file-document-outline" class="size-6 text-primary" />
			</div>
			<h2 class="text-base font-semibold">用户协议同意</h2>
			<p class="text-xs text-muted-foreground leading-relaxed">
				请阅读并同意以下协议后继续使用
			</p>
			<div class="flex flex-col items-start gap-3 text-xs border rounded-lg px-4 py-3">
				<label class="flex items-start gap-2 cursor-pointer">
					<Checkbox bind:checked />
					<span>
						我同意 <a href="/posts/draw-user-agreement/" target="_blank" class="text-primary underline">《AI生图用户协议》</a>
						和 <a href="/posts/privacy-policy/" target="_blank" class="text-primary underline">《隐私政策》</a>
					</span>
				</label>
			</div>
			<Button class="w-full" disabled={!checked} onclick={onAccept}>
				<Icon icon="mdi:check" class="size-4 mr-1" />
				同意并继续
			</Button>
		</div>
	</div>
{/if}
