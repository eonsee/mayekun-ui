<template>
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
            <div class="article-content" v-html="renderedContent"></div>
            <aside class="article-sidebar">
              <ArticleToc :content="article.content" />
            </aside>
          </div>
        </div>
      </div>

      <!-- Copyright Notice -->
      <div class="copyright-notice">
        <div class="container">
          <div class="copyright-content">
            <h4>版权声明</h4>
            <p>本文作者：{{ profile.name }}</p>
            <p>本文首发于 <a href="https://mayekun.com" target="_blank">mayekun.com</a>，转载请注明出处。</p>
            <p>© {{ currentYear }} {{ profile.name }} 版权所有，未经授权禁止转载。</p>
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
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Share2, FileQuestion, ArrowLeft } from 'lucide-vue-next'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'
import { useBlogStore } from '@/store'
import ArticleCard from '@/components/article/ArticleCard.vue'
import ArticleToc from '@/components/article/ArticleToc.vue'
import myAvatar from '@/assets/my.jpg'

const route = useRoute()
const blogStore = useBlogStore()

const article = computed(() => blogStore.getArticleById(route.params.id as string))
const profile = computed(() => blogStore.profileData)
const currentYear = computed(() => new Date().getFullYear())
const relatedArticles = computed(() => {
  if (!article.value) return []
  return blogStore.getRelatedArticles(article.value.id)
})

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code>${hljs.highlight(str, { language: lang, ignoreIllegals: true }).value}</code></pre>`
      } catch (e) {
        console.error(e)
      }
    }
    return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`
  }
})

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
}

.article-cover img {
  width: 100%;
  height: auto;
}

.article-content-wrapper {
  padding: 48px 0;
}

.article-layout {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 48px;
}

.article-content {
  max-width: 720px;
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

.article-content :deep(pre) {
  margin: 24px 0;
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.article-content :deep(code) {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.875rem;
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

/* Copyright Notice */
.copyright-notice {
  padding: 32px 0;
  background: var(--bg-secondary);
  margin-top: 32px;
}

.copyright-content {
  max-width: 720px;
  padding: 24px;
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  border-left: 4px solid var(--primary-color);
}

.copyright-content h4 {
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.copyright-content p {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.8;
  margin-bottom: 8px;
}

.copyright-content p:last-child {
  margin-bottom: 0;
}

.copyright-content a {
  color: var(--primary-color);
  text-decoration: none;
}

.copyright-content a:hover {
  text-decoration: underline;
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
