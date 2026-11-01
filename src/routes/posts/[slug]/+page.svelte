<script lang="ts">
	import { page } from '$app/stores';
	import { siteConfig } from '$lib/config/site';
	import Icon from '@iconify/svelte';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { fadeInUp } from '$lib/utils/motion';
	import Giscus from '$lib/components/Giscus.svelte';

	let { data } = $props();
	const post = $derived(data.post);

	function formatDate(s: string): string {
		try {
			const d = new Date(s);
			return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
		} catch {
			return s;
		}
	}

	function readTime(words: number): number {
		return Math.max(1, Math.round(words / 400));
	}
</script>

<svelte:head>
	<title>{post.metadata.title} - {siteConfig.siteName}</title>
	<meta name="description" content={post.metadata.description} />
	<meta property="og:title" content={post.metadata.title} />
	<meta property="og:description" content={post.metadata.description} />
	{#if post.metadata.image}
		<meta property="og:image" content={post.metadata.image} />
	{/if}
	<meta property="og:url" content="{siteConfig.url}/posts/{post.slug}/" />
	<meta property="article:published_time" content={post.metadata.published} />
</svelte:head>

<div class="mx-auto w-full max-w-3xl px-4 py-8 mo-fade-in-up" use:fadeInUp>
	<!-- 返回 -->
	<div class="mb-6">
		<a href="/posts/">
			<Button variant="ghost" size="sm" class="gap-1.5">
				<Icon icon="mdi:arrow-left" class="size-4" />
				返回列表
			</Button>
		</a>
	</div>

	<!-- 标题区 -->
	<header class="mb-8 border-b border-border pb-6">
		<h1 class="mb-3 text-3xl font-bold leading-tight md:text-4xl">{post.metadata.title}</h1>

		{#if post.metadata.description}
			<p class="mb-4 text-base text-muted-foreground">{post.metadata.description}</p>
		{/if}

		<div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
			<time datetime={post.metadata.published}>{formatDate(post.metadata.published)}</time>
			<span>·</span>
			<span>{data.wordCount} 字</span>
			<span>·</span>
			<span>约 {readTime(data.wordCount)} 分钟</span>
			<span>·</span>
			<a
				href={post.url}
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center gap-1 hover:text-primary"
			>
				原文
				<Icon icon="mdi:open-in-new" class="size-3.5" />
			</a>
		</div>
	</header>

	<!-- 正文 -->
	<article class="prose prose-neutral max-w-none dark:prose-invert
		prose-headings:scroll-mt-20
		prose-a:text-primary prose-a:underline prose-a:underline-offset-4
		prose-code:rounded prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5
		prose-code:before:content-none prose-code:after:content-none
		prose-pre:bg-muted prose-pre:text-foreground
		prose-img:rounded-lg
		prose-table:text-sm
		prose-blockquote:border-l-primary">
		{@html post.content}
	</article>

	<!-- 评论 -->
	<Giscus />

	<!-- 底部 -->
	<footer class="mt-12 border-t border-border pt-6">
		<div class="flex flex-wrap items-center justify-between gap-4">
			<a href="/posts/">
				<Button variant="outline" size="sm" class="gap-1.5">
					<Icon icon="mdi:arrow-left" class="size-4" />
					返回列表
				</Button>
			</a>
			<a href={post.url} target="_blank" rel="noopener noreferrer">
				<Button variant="outline" size="sm" class="gap-1.5">
					在博客上阅读
					<Icon icon="mdi:open-in-new" class="size-4" />
				</Button>
			</a>
		</div>
	</footer>
</div>
