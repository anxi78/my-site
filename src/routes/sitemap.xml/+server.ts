import { siteConfig } from '$lib/config/site';
import type { RequestHandler } from './$types';

export const prerender = true;

export const GET: RequestHandler = async () => {
	const baseUrl = siteConfig.url;

	const staticPages = [
		{ url: '/', priority: '1.0', changefreq: 'daily' },
		{ url: '/posts/', priority: '0.9', changefreq: 'daily' },
		{ url: '/cover/', priority: '0.7', changefreq: 'weekly' },
		{ url: '/friends/', priority: '0.6', changefreq: 'monthly' },
		{ url: '/short/', priority: '0.5', changefreq: 'monthly' }
	];

	const now = new Date().toISOString().split('T')[0];

	const urls = staticPages
		.map(
			(p) => `	<url>
		<loc>${baseUrl}${p.url}</loc>
		<lastmod>${now}</lastmod>
		<changefreq>${p.changefreq}</changefreq>
		<priority>${p.priority}</priority>
	</url>`
		)
		.join('\n');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=3600'
		}
	});
};
