import { createHash } from 'node:crypto'
import { readdir, readFile, rename, writeFile } from 'node:fs/promises'
import { basename, join } from 'node:path'
import { PurgeCSS } from 'purgecss'

const out = '.output/public'
const cssDir = join(out, '_nuxt')
const cssFiles = (await readdir(cssDir)).filter((f) => f.startsWith('entry.') && f.endsWith('.css')).map((f) => join(cssDir, f))
const htmlFiles = (await readdir(out)).filter((f) => f.endsWith('.html')).map((f) => join(out, f))

const results = await new PurgeCSS().purge({
  content: [
    join(out, 'index.html'),
    'app/**/*.{vue,ts}',
    'node_modules/swiper/shared/*.mjs',
    'node_modules/swiper/modules/{autoplay,free-mode}.mjs',
  ],
  css: cssFiles,
  // Tailwind-style class names contain `:`, `[`, `]`, `/`, `%`, `#`, `&`.
  defaultExtractor: (content) => content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [],
  safelist: {
    standard: ['html', 'body', /^__variable_/, /^swiper/, /^pin-spacer/, 'loaded', 'is-touch', 'menu-open'],
    greedy: [/^swiper-/],
  },
  fontFace: false,
  keyframes: false,
  variables: false,
})

for (const { file, css } of results) {
  const before = (await readFile(file, 'utf8')).length
  // The purged file gets a new hash so long-lived caches never serve stale CSS.
  const hash = createHash('sha256').update(css).digest('base64url').slice(0, 8)
  const oldName = basename(file)
  const newName = `entry.${hash}.css`
  await writeFile(file, css)
  await rename(file, join(cssDir, newName))
  for (const html of htmlFiles) {
    const src = await readFile(html, 'utf8')
    if (src.includes(oldName)) await writeFile(html, src.replaceAll(oldName, newName))
  }
  console.log(`purge-css: ${oldName} ${(before / 1024).toFixed(0)}K -> ${newName} ${(css.length / 1024).toFixed(0)}K`)
}
