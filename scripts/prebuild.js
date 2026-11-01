import { spawnSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const require = createRequire(import.meta.url);

function run(cmd, args, label) {
	console.log(`\n═══════════════════════════════════════`);
	console.log(`   ${label}`);
	console.log(`═══════════════════════════════════════\n`);

	const result = spawnSync(cmd, args, {
		cwd: root,
		stdio: 'inherit',
		shell: true
	});

	if (result.status !== 0) {
		console.error(`\n  ❌ ${label} 失败，退出码 ${result.status}\n`);
		process.exit(result.status);
	}

	console.log(`  ✅ ${label} 完成\n`);
}

console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
console.log(`   SVAF 预构建流水线`);
console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

const start = Date.now();

// 博客内容已改为从外部 RSS 拉取，不再处理本地文章图片。
// 原来 4 步（清理图片 → 规范化文件名 → vite build → AVIF 转换）
// 精简为单步构建。
run('pnpm', ['exec', 'vite', 'build'], '构建');

const elapsed = ((Date.now() - start) / 1000).toFixed(1);
console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
console.log(`   全部完成，耗时 ${elapsed}s`);
console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
