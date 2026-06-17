<template>
  <!-- Article Found -->
  <div class="article-detail-page" v-if="article">
    <article class="article-container">
      <!-- Article Header -->
      <header class="article-header">
        <div class="container">
          <div class="article-meta">
            <span class="category">{{ article.category }}</span>
            <span class="divider">·</span>
            <span class="date">{{ article.createdAt }}</span>
            <span class="divider">·</span>
            <span class="read-time">{{ article.readTime }} 分钟阅读</span>
          </div>
          <h1 class="article-title">{{ article.title }}</h1>
          <p class="article-summary">{{ article.summary }}</p>
          <div class="article-tags">
            <span v-for="tag in article.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </div>
      </header>

      <!-- Article Cover -->
      <div class="article-cover">
        <img :src="article.cover" :alt="article.title" />
      </div>

      <!-- Article Content -->
      <div class="article-content-wrapper">
        <div class="container">
          <div class="article-layout">
            <div class="article-main">
              <div class="article-content" v-html="renderedContent"></div>
              <p class="copyright-text">
                本站内容均为原创首发，未经许可，不允许转载。
              </p>
            </div>
            <aside class="article-sidebar">
              <ArticleToc :content="article.content" />
            </aside>
          </div>
        </div>
      </div>

      <!-- Article Footer -->
      <footer class="article-footer">
        <div class="container">
          <div class="author-info">
            <img :src="myAvatar" :alt="profile.name" class="author-avatar" />
            <div class="author-details">
              <div class="author-name">{{ profile.name }}</div>
              <div class="author-title">{{ profile.title }}</div>
            </div>
          </div>

          <div class="article-actions">
            <button class="action-btn" @click="shareArticle">
              <Share2 :size="18" />
              分享
            </button>
          </div>
        </div>
      </footer>
    </article>

    <!-- Article Navigation -->
    <section class="article-navigation" v-if="prevArticle || nextArticle">
      <div class="container">
        <div class="nav-cards">
          <router-link
            v-if="prevArticle"
            :to="`/article/${prevArticle.id}`"
            class="nav-card prev"
          >
            <div class="nav-direction">
              <ChevronLeft :size="20" />
              <span>上一篇</span>
            </div>
            <div class="nav-title">{{ prevArticle.title }}</div>
          </router-link>
          <div v-else class="nav-card empty"></div>

          <router-link
            v-if="nextArticle"
            :to="`/article/${nextArticle.id}`"
            class="nav-card next"
          >
            <div class="nav-direction">
              <span>下一篇</span>
              <ChevronRight :size="20" />
            </div>
            <div class="nav-title">{{ nextArticle.title }}</div>
          </router-link>
          <div v-else class="nav-card empty"></div>
        </div>
      </div>
    </section>

    <!-- Related Articles -->
    <section class="related-section" v-if="relatedArticles.length > 0">
      <div class="container">
        <h2 class="section-title">相关文章</h2>
        <div class="related-grid">
          <ArticleCard
            v-for="relatedArticle in relatedArticles"
            :key="relatedArticle.id"
            :article="relatedArticle"
          />
        </div>
      </div>
    </section>
  </div>

  <!-- Auto Reader -->
  <template v-if="article">
    <AutoReader />
  </template>

  <!-- Loading -->
  <div v-else-if="articleLoading" class="not-found">
    <div class="container">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>
  </div>

  <!-- Not Found -->
  <div v-else class="not-found">
    <div class="container">
      <FileQuestion :size="64" />
      <h2>文章不存在</h2>
      <p>该文章可能已被删除或移除</p>
      <router-link to="/articles" class="back-btn">
        <ArrowLeft :size="18" />
        返回文章列表
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Share2, FileQuestion, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'
import { useBlogStore } from '@/store'
import type { Article } from '@/types'
import ArticleCard from '@/components/article/ArticleCard.vue'
import ArticleToc from '@/components/article/ArticleToc.vue'
import AutoReader from '@/components/article/AutoReader.vue'
import myAvatar from '@/assets/my.jpg'

const route = useRoute()
const blogStore = useBlogStore()

// 文章详情：优先调用后端接口，失败时回退到本地 store
const article = ref<Article | null>(null)
const articleLoading = ref(false)

const loadArticle = async (id: string) => {
  articleLoading.value = true
  try {
    const detail = await blogStore.fetchArticleDetail(id)
    if (detail) {
      article.value = detail
    } else {
      // 接口未返回，回退到本地数据
      article.value = blogStore.getArticleById(id) || null
    }
  } catch (e) {
    console.warn('[ArticleDetail] 获取文章详情失败，使用本地数据', e)
    article.value = blogStore.getArticleById(id) || null
  } finally {
    articleLoading.value = false
  }
}

onMounted(() => {
  loadArticle(route.params.id as string)
})

// 路由变化时重新加载文章并滚动到顶部
watch(() => route.params.id, (newId) => {
  if (newId) {
    window.scrollTo(0, 0)
    loadArticle(newId as string)
  }
})

const profile = computed(() => blogStore.profileData)
const currentYear = computed(() => new Date().getFullYear())
const relatedArticles = computed(() => {
  if (!article.value) return []
  return blogStore.getRelatedArticles(article.value.id)
})

const prevNextArticles = computed(() => {
  if (!article.value) return { prev: null, next: null }
  return blogStore.getPrevNextArticles(article.value.id)
})

const prevArticle = computed(() => prevNextArticles.value.prev)
const nextArticle = computed(() => prevNextArticles.value.next)

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    let code = str
    if (lang && hljs.getLanguage(lang)) {
      try {
        code = hljs.highlight(str, { language: lang, ignoreIllegals: true }).value
      } catch (e) {
        console.error(e)
      }
    } else {
      code = md.utils.escapeHtml(str)
    }

    const lines = code.split('\n')
    const linesCode = lines.map((line, i) => {
      return `<span class="code-line"><span class="line-number">${i + 1}</span><span class="line-content">${line}</span></span>`
    }).join('')

    return `<div class="code-block"><div class="code-header"><span class="code-lang">${lang || 'code'}</span><button class="copy-btn" onclick="copyCode(this)">复制</button></div><pre class="hljs"><code>${linesCode}</code></pre></div>`
  }
})

// 为标题添加 id
md.renderer.rules.heading_open = function (tokens, idx) {
  const token = tokens[idx]
  const level = token.tag
  const nextToken = tokens[idx + 1]
  if (nextToken && nextToken.type === 'inline') {
    const text = nextToken.content
    const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\u4e00-\u9fa5-]/g, '')
    return `<${level} id="${id}">`
  }
  return `<${level}>`
}

// 全局复制函数
;(window as any).copyCode = function(btn: HTMLElement) {
  const codeBlock = btn.closest('.code-block')
  const code = codeBlock?.querySelector('code')
  if (code) {
    const text = code.textContent || ''
    navigator.clipboard.writeText(text).then(() => {
      btn.textContent = '已复制'
      setTimeout(() => {
        btn.textContent = '复制'
      }, 2000)
    })
  }
}

const renderedContent = computed(() => {
  if (!article.value) return ''
  return md.render(article.value.content)
})

const shareArticle = () => {
  if (navigator.share) {
    navigator.share({
      title: article.value?.title,
      text: article.value?.summary,
      url: window.location.href
    })
  } else {
    navigator.clipboard.writeText(window.location.href)
    alert('链接已复制到剪贴板')
  }
}
</script>

<style scoped>
.article-detail-page {
  padding-bottom: 80px;
}

.article-header {
  padding: 48px 0;
  text-align: center;
  background: var(--bg-secondary);
}

.article-meta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 0.875rem;
  color: var(--text-tertiary);
  margin-bottom: 16px;
}

.divider {
  color: var(--border-color);
}

.category {
  color: var(--primary-color);
  font-weight: 500;
}

.article-title {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.3;
  max-width: 800px;
  margin: 0 auto 16px;
}

.article-summary {
  font-size: 1.125rem;
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto 24px;
  line-height: 1.6;
}

.article-tags {
  display: flex;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  padding: 6px 14px;
  background: var(--bg-primary);
  border-radius: var(--radius-full);
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

.article-cover {
  max-width: 1000px;
  margin: 0 auto;
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-xl);
  margin-top: -24px;
  aspect-ratio: 16 / 9;
}

.article-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.article-content-wrapper {
  padding: 48px 0;
}

.article-layout {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 48px;
}

.article-main {
  max-width: 720px;
}

.article-content {
  max-width: 720px;
}

.copyright-text {
  font-size: 0.8125rem;
  color: var(--text-tertiary);
  margin-top: 32px;
  padding: 12px 16px;
  background: #f8fafc;
  border-radius: var(--radius-md);
}

.article-content :deep(h1),
.article-content :deep(h2),
.article-content :deep(h3),
.article-content :deep(h4) {
  margin-top: 32px;
  margin-bottom: 16px;
}

.article-content :deep(p) {
  margin-bottom: 16px;
  line-height: 1.8;
}

/* 代码块样式 */
.article-content :deep(.code-block) {
  margin: 24px 0;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: #1e1e1e;
}

.article-content :deep(.code-header) {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background: #2d2d2d;
  border-bottom: 1px solid #3d3d3d;
}

.article-content :deep(.code-lang) {
  font-size: 0.75rem;
  color: #888;
  text-transform: uppercase;
}

.article-content :deep(.copy-btn) {
  padding: 4px 12px;
  font-size: 0.75rem;
  color: #888;
  background: transparent;
  border: 1px solid #444;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.article-content :deep(.copy-btn:hover) {
  color: #fff;
  border-color: #666;
}

.article-content :deep(pre.hljs) {
  margin: 0;
  padding: 16px;
  background: #1e1e1e;
  overflow-x: auto;
}

.article-content :deep(code) {
  font-family: Consolas, Monaco, 'Courier New', monospace;
  font-size: 0.875rem;
  line-height: 1.6;
}

.article-content :deep(.code-line) {
  display: block;
  min-height: 1.6em;
}

.article-content :deep(.line-number) {
  display: inline-block;
  width: 40px;
  color: #555;
  text-align: right;
  padding-right: 16px;
  user-select: none;
}

.article-content :deep(.line-content) {
  color: #d4d4d4;
}

/* 行内代码 */
.article-content :deep(code:not(.hljs code)) {
  padding: 2px 6px;
  background: var(--bg-secondary);
  border-radius: var(--radius-sm);
  font-family: Consolas, Monaco, 'Courier New', monospace;
  font-size: 0.875rem;
}

.article-content :deep(pre) {
  margin: 24px 0;
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.article-content :deep(blockquote) {
  margin: 24px 0;
  padding: 16px 24px;
  border-left: 4px solid var(--primary-color);
  background: var(--bg-secondary);
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
}

.article-content :deep(ul),
.article-content :deep(ol) {
  margin: 16px 0;
  padding-left: 24px;
}

.article-content :deep(li) {
  margin-bottom: 8px;
  line-height: 1.6;
}

.article-content :deep(a) {
  color: var(--primary-color);
  text-decoration: underline;
}

.article-content :deep(img) {
  border-radius: var(--radius-lg);
  margin: 24px 0;
}

.article-sidebar {
  position: sticky;
  top: 88px;
  height: fit-content;
}

.article-footer {
  padding: 32px 0;
  border-top: 1px solid var(--border-color);
}

.article-footer .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.author-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.author-name {
  font-weight: 600;
  color: var(--text-primary);
}

.author-title {
  font-size: 0.875rem;
  color: var(--text-tertiary);
}

.article-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
  transition: all var(--transition-fast);
}

.action-btn:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

/* Article Navigation */
.article-navigation {
  padding: 48px 0;
  background: var(--bg-primary);
}

.nav-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.nav-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 24px;
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  text-decoration: none;
  transition: all var(--transition-fast);
}

.nav-card:hover {
  background: var(--bg-tertiary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.nav-card.empty {
  background: transparent;
}

.nav-direction {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.875rem;
  color: var(--text-tertiary);
}

.nav-title {
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-primary);
  line-height: 1.4;
}

.nav-card.next {
  text-align: right;
}

.nav-card.next .nav-direction {
  justify-content: flex-end;
}

.related-section {
  padding: 64px 0;
  background: var(--bg-secondary);
}

.section-title {
  font-size: 1.75rem;
  margin-bottom: 32px;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.not-found {
  text-align: center;
  padding: 120px 20px;
  color: var(--text-tertiary);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  margin: 0 auto 16px;
  border: 3px solid var(--border-color);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.not-found svg {
  margin-bottom: 16px;
  opacity: 0.5;
}

.not-found h2 {
  font-size: 1.5rem;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 24px;
  padding: 12px 24px;
  background: var(--primary-gradient);
  color: white;
  border-radius: var(--radius-lg);
  font-weight: 500;
}

@media (max-width: 1024px) {
  .article-layout {
    grid-template-columns: 1fr;
  }

  .article-sidebar {
    display: none;
  }

  .related-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .nav-cards {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .article-title {
    font-size: 1.75rem;
  }

  .article-footer .container {
    flex-direction: column;
    gap: 16px;
  }

  .related-grid {
    grid-template-columns: 1fr;
  }
}
</style>
