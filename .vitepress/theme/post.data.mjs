import { createContentLoader } from 'vitepress'


export default createContentLoader('/**/*.md', {
  includeSrc: false, // 包含原始 markdown 源?
  render: false,     // 包含渲染的整页 HTML?
  excerpt: '<!-- more -->',    // 包含摘录?
  transform(raw) {
    return raw
			.filter(({url}) => url !== '/')
      .map(({ url, frontmatter, excerpt, html }) => {
        return ({
          title: frontmatter.title,
          url,
          excerpt,
          html,
          author: frontmatter.author || '小磊',
          tags: frontmatter.tags,
          date: formatDate(frontmatter.date)
        })
      })
      .sort((a, b) => b.date.time - a.date.time)
  },
})

function formatDate(raw) {
  const date = new Date(raw)
  date.setUTCHours(12)
  return {
    time: +date,
    string: date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
}
