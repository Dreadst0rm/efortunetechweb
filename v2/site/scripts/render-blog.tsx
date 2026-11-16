import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import Shell from '../src/layout/Shell'
import { loadBlogPosts } from '../src/blog/loadUpdates'
import { blogPostPath } from '../src/blog/dates'
import { renderBlogRss } from '../src/blog/rss'
import { blogSite } from '../src/blog/siteMeta'
import BlogIndexPage from '../src/pages/BlogIndexPage'
import BlogPostPage from '../src/pages/BlogPostPage'
import { renderHead, type PageSeo } from '../src/seo'
import { buildDigestIndexEntry } from '../src/blog/blogFilter'
import { htmlRootAttrs } from '../src/siteBuild'

export function renderBlog(dist: string, contentRoot: string, siteOrigin: string) {
  const updatesDir = path.join(contentRoot, 'content', 'blog', 'updates')
  const posts = loadBlogPosts(updatesDir)

  const vtRules = posts
    .map((u) => {
      const name = `b${u.data.date.replaceAll('-', '')}`
      return `.bp-digest__card[data-vt-date="${u.data.date}"], .bp-digest__vt-header[data-vt-date="${u.data.date}"] { view-transition-name: ${name}; }`
    })
    .join('\n')
  const vtCssPath = path.join(dist, 'assets', 'blog-vt.css')
  mkdirSync(path.dirname(vtCssPath), { recursive: true })
  writeFileSync(vtCssPath, vtRules, 'utf8')

  function writeBlogPage(out: string, seo: PageSeo, body: JSX.Element) {
    const inner = renderToStaticMarkup(createElement(Shell, { active: 'blog', children: body }))
    const scripts = [
      ...(seo.scripts ?? []).map((src) => `<script src="${src}"></script>`),
      ...(seo.moduleScripts ?? []).map((src) => `<script type="module" src="${src}"></script>`),
    ].join('\n  ')
    const html = `<!DOCTYPE html>
<html ${htmlRootAttrs()}>
<head>
  ${renderHead(seo)}
</head>
<body class="bp-vt-root">
  ${inner}
  ${scripts}
</body>
</html>
`
    const file = path.join(dist, out)
    mkdirSync(path.dirname(file), { recursive: true })
    writeFileSync(file, html, 'utf8')
    console.log('wrote', out)
  }

  const indexEntries = posts.map((u) =>
    buildDigestIndexEntry({
      date: u.data.date,
      title: u.data.title,
      summary: u.data.summary,
      sectionText: u.data.sections
        .map((s) => `${s.heading}\n${s.bullets.join('\n')}`)
        .join('\n'),
    }),
  )
  const blogDir = path.join(dist, 'blog')
  mkdirSync(blogDir, { recursive: true })
  writeFileSync(path.join(blogDir, 'index.json'), JSON.stringify(indexEntries, null, 2), 'utf8')
  console.log('wrote blog/index.json')

  const indexSeo: PageSeo = {
    title: `Blog | efortune.tech`,
    description: blogSite.description,
    canonicalPath: '/blog/',
    extraHead: '<link rel="stylesheet" href="/assets/blog-vt.css">',
    moduleScripts: ['/assets/islands/blog-filters.js'],
  }
  writeBlogPage('blog/index.html', indexSeo, <BlogIndexPage posts={posts} />)

  posts.forEach((post, index) => {
    const newer = index > 0 ? posts[index - 1] : undefined
    const older = posts[index + 1]
    const canonical = blogPostPath(post.data.date)
    const seo: PageSeo = {
      title: `${post.data.title} | Blog`,
      description: post.data.summary,
      canonicalPath: canonical,
      extraHead: '<link rel="stylesheet" href="/assets/blog-vt.css">',
    }
    const out = `blog/updates/${post.data.date}/index.html`
    writeBlogPage(out, seo, <BlogPostPage post={post} newer={newer} older={older} />)
  })

  const rss = renderBlogRss(posts, siteOrigin)
  writeFileSync(path.join(blogDir, 'rss.xml'), rss, 'utf8')
  console.log('wrote blog/rss.xml')

  const urlMap = [
  { from: 'https://digest.efortune.tech/', to: `${siteOrigin.replace(/\/$/, '')}/blog/` },
  { from: 'https://digest.efortune.tech/rss.xml', to: `${siteOrigin.replace(/\/$/, '')}/blog/rss.xml` },
  { from: 'https://digest.efortune.tech/about/', to: `${siteOrigin.replace(/\/$/, '')}/about.html` },
  ...posts.map((p) => ({
      from: `https://digest.efortune.tech/updates/${p.data.date}/`,
      to: `${siteOrigin.replace(/\/$/, '')}${blogPostPath(p.data.date)}`,
    })),
  ]
  writeFileSync(
    path.join(contentRoot, 'content', 'blog', 'digest-url-map.json'),
    JSON.stringify(urlMap, null, 2),
    'utf8',
  )
  console.log('wrote site/content/blog/digest-url-map.json')

  return { posts, siteOrigin }
}