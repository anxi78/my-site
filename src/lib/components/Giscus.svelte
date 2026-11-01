<script lang="ts">
	import { onMount } from 'svelte';
	import { isDark } from '$lib/stores/theme';
	import { siteConfig } from '$lib/config/site';

	let loaded = $state(false);
	let container: HTMLDivElement;

	onMount(() => {
		// 没配 repo 就不加载
		if (!siteConfig.giscus.repo || !siteConfig.giscus.repoId) return;

		const dark = document.documentElement.classList.contains('dark');
		const script = document.createElement('script');
		script.src = 'https://giscus.app/client.js';
		script.setAttribute('data-repo', siteConfig.giscus.repo);
		script.setAttribute('data-repo-id', siteConfig.giscus.repoId);
		script.setAttribute('data-category', siteConfig.giscus.category);
		script.setAttribute('data-category-id', siteConfig.giscus.categoryId);
		script.setAttribute('data-mapping', 'pathname');
		script.setAttribute('data-strict', '0');
		script.setAttribute('data-reactions-enabled', '1');
		script.setAttribute('data-emit-metadata', '0');
		script.setAttribute('data-input-position', 'top');
		script.setAttribute('data-theme', dark ? 'dark' : 'light');
		script.setAttribute('data-lang', 'zh-CN');
		script.setAttribute('data-loading', 'lazy');
		script.setAttribute('crossorigin', 'anonymous');
		script.async = true;

		script.onload = () => {
			loaded = true;
		};

		container.appendChild(script);
	});

	// 主题切换时同步 iframe
	$effect(() => {
		const dark = $isDark;
		const frame = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame');
		if (frame?.contentWindow) {
			frame.contentWindow.postMessage(
				{ giscus: { setConfig: { theme: dark ? 'dark' : 'light' } } },
				'https://giscus.app'
			);
		}
	});
</script>

<div id="comments" class="mt-12 scroll-mt-20 border-t border-border pt-8">
	<h2 class="mb-4 text-xl font-semibold">评论</h2>
	<div bind:this={container} class="min-h-[200px]"></div>
	{#if !loaded && siteConfig.giscus.repo}
		<p class="text-sm text-muted-foreground">评论加载中…</p>
	{/if}
</div>
