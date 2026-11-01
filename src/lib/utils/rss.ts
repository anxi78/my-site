/**
 * RSS 解析
 * =========
 * 博客内容来自外部 RSS 源（配置在 siteConfig.blog.rssUrl），
 * 不再读本地 markdown 文件。
 */

export type RssPost = {
	slug: string;
	metadata: {
		title: string;
		description: string;
		published: string;
		image?: string;
		pinned?: boolean;
		tags?: string[];
	};
	/** HTML 正文 */
	content: string;
	/** 原文链接 */
	url: string;
};

export type RssFeed = {
	title: string;
	description: string;
	link: string;
	posts: RssPost[];
};

/** 从链接里取 slug：https://x.com/posts/foo/ → foo */
function slugFromLink(link: string): string {
	try {
		const u = new URL(link);
		const parts = u.pathname.split('/').filter(Boolean);
		return parts[parts.length - 1] || u.pathname;
	} catch {
		return link;
	}
}

/** 解码 HTML 实体
 *
 * 这个博客的 RSS 里 content:encoded 是**双重转义**的：
 *   原文 <p>  →  XML 层 &lt;p&gt;  →  内容层 &amp;lt;p&amp;gt;
 * 所以解码一次不够，要一直解到不再变化（最多 3 轮，防止死循环）。
 */
function decodeEntities(s: string): string {
	let prev = '';
	let cur = s;
	for (let i = 0; i < 3 && cur !== prev; i++) {
		prev = cur;
		cur = cur
			.replace(/&lt;/g, '<')
			.replace(/&gt;/g, '>')
			.replace(/&quot;/g, '"')
			.replace(/&#39;/g, "'")
			.replace(/&apos;/g, "'")
			.replace(/&amp;/g, '&');
	}
	return cur;
}

/** 提取某个标签的文本内容 */
function tagText(xml: string, tag: string): string {
	// 处理 CDATA
	const cdata = new RegExp(`<${tag}[^>]*>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*</${tag}>`, 'i');
	const m1 = xml.match(cdata);
	if (m1) return m1[1].trim();

	const plain = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i');
	const m2 = xml.match(plain);
	return m2 ? m2[1].trim() : '';
}

/** 解析 RSS XML */
export function parseRss(xml: string): RssFeed {
	const channelTitle = tagText(xml, 'title');
	const channelDesc = tagText(xml, 'description');
	const channelLink = tagText(xml, 'link');

	const items: RssPost[] = [];
	const itemRe = /<item[\s>][\s\S]*?<\/item>/gi;
	const matches = xml.match(itemRe) || [];

	for (const item of matches) {
		const title = decodeEntities(tagText(item, 'title'));
		const link = tagText(item, 'link');
		const desc = decodeEntities(tagText(item, 'description'));
		const pubDate = tagText(item, 'pubDate');

		// content:encoded 带命名空间
		let content = '';
		const ceRe = /<content:encoded[^>]*>\s*(?:<!\[CDATA\[([\s\S]*?)\]\]>|([\s\S]*?))<\/content:encoded>/i;
		const ce = item.match(ceRe);
		if (ce) content = decodeEntities(ce[1] ?? ce[2] ?? '');

		// 没有 content:encoded 就用 description
		if (!content) content = desc;

		// 封面：只认 RSS 里显式的 <enclosure> 或 media:content，
		// 不从正文抓第一张图 —— 那样每篇都会被迫"有封面"。
		let image: string | undefined;
		const enc = item.match(/<enclosure[^>]+url=["']([^"']+)["']/i);
		if (enc) image = enc[1];
		if (!image) {
			const media = item.match(/<media:content[^>]+url=["']([^"']+)["']/i);
			if (media) image = media[1];
		}

		items.push({
			slug: slugFromLink(link),
			metadata: {
				title,
				description: desc,
				published: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
				image
			},
			content,
			url: link
		});
	}

	return {
		title: decodeEntities(channelTitle),
		description: decodeEntities(channelDesc),
		link: channelLink,
		posts: items
	};
}

/** 从 URL 拉取并解析 */
export async function fetchRss(url: string, fetchFn = fetch): Promise<RssFeed> {
	const res = await fetchFn(url, {
		headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AnxiSite/1.0)' }
	});
	if (!res.ok) throw new Error(`RSS fetch failed: ${res.status} ${res.statusText}`);
	const xml = await res.text();
	return parseRss(xml);
}

/** 估算字数 */
export function wordCount(html: string): number {
	const text = html.replace(/<[^>]*>/g, '');
	const cn = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
	const en = (text.match(/[a-zA-Z]+/g) || []).length;
	return cn + en;
}
