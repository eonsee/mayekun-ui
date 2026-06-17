<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-bg">
        <div class="hero-gradient"></div>
        <div class="hero-particles">
          <div v-for="i in 20" :key="i" class="particle" :style="getParticleStyle(i)"></div>
        </div>
      </div>
      <div class="container hero-content">
        <div class="hero-text">
          <h1 class="hero-title animate-fade-in-up">
            Hey，我是 <span class="gradient-text">{{ profile.name }}</span>
          </h1>
          <p class="hero-subtitle animate-fade-in-up" style="animation-delay: 0.1s">
            {{ profile.title }}
          </p>
          <p class="hero-description animate-fade-in-up" style="animation-delay: 0.2s">
            {{ profile.bio }}
          </p>
          <div class="hero-actions animate-fade-in-up" style="animation-delay: 0.3s">
            <router-link to="/articles" class="btn btn-primary">
              <BookOpen :size="18" />
              浏览文章
            </router-link>
            <router-link to="/about" class="btn btn-secondary">
              <User :size="18" />
              了解更多
            </router-link>
          </div>
        </div>
        <div class="hero-visual animate-fade-in" style="animation-delay: 0.4s">
          <div class="hero-avatar-wrapper">
            <img src="/my.jpg" alt="Avatar" class="hero-avatar" />
            <div class="avatar-ring"></div>
          </div>
        </div>
      </div>
      <div class="scroll-indicator">
        <ChevronDown :size="24" />
      </div>
    </section>

    <!-- Featured Articles -->
    <section class="featured-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">精选文章</h2>
          <router-link to="/articles" class="view-all">
            查看全部 <ArrowRight :size="16" />
          </router-link>
        </div>
        <div class="articles-grid">
          <ArticleCard
            v-for="(article, index) in featuredArticles"
            :key="article.id"
            :article="article"
            :style="{ animationDelay: `${index * 0.1}s` }"
            class="animate-fade-in-up"
          />
        </div>
      </div>
    </section>

    <!-- Works Section -->
    <section class="works-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">作品展示</h2>
          <router-link to="/works" class="view-all">
            查看全部 <ArrowRight :size="16" />
          </router-link>
        </div>
        <div class="works-showcase">
          <!-- 左侧作品选择列表 -->
          <div class="works-selector">
            <div
              v-for="work in featuredWorks"
              :key="work.id"
              class="work-item"
              :class="{ active: selectedWork?.id === work.id }"
              @click="selectedWork = work"
            >
              <div class="work-item-thumb">
                <img :src="work.cover" :alt="work.title" />
              </div>
              <div class="work-item-info">
                <span class="work-item-category">{{ work.category }}</span>
                <h4 class="work-item-title">{{ work.title }}</h4>
                <p class="work-item-desc">{{ work.description }}</p>
                <div class="work-item-tags">
                  <span v-for="tag in work.tags.slice(0, 2)" :key="tag" class="mini-tag">{{ tag }}</span>
                </div>
              </div>
              <ChevronRight :size="16" class="work-item-arrow" />
            </div>
          </div>

          <!-- 右侧预览区 -->
          <div class="works-preview">
            <div v-if="selectedWork" class="preview-content">
              <!-- 浏览器窗口 -->
              <div class="preview-browser">
                <div class="browser-toolbar">
                  <div class="browser-dots">
                    <span class="dot"></span>
                    <span class="dot"></span>
                    <span class="dot"></span>
                  </div>
                  <div class="browser-address">
                    <Lock :size="12" />
                    <span class="address-text">{{ selectedWork.link || '本地预览' }}</span>
                  </div>
                  <div class="browser-actions">
                    <a v-if="selectedWork.link" :href="selectedWork.link" target="_blank" class="browser-action-btn" @click.stop title="新窗口打开">
                      <ExternalLink :size="14" />
                    </a>
                    <a v-if="selectedWork.github" :href="selectedWork.github" target="_blank" class="browser-action-btn" @click.stop title="GitHub">
                      <Github :size="14" />
                    </a>
                  </div>
                </div>
                <div class="browser-viewport">
                  <!-- 有真实链接时用 iframe 展示 -->
                  <iframe
                    v-if="selectedWork.link"
                    :src="selectedWork.link"
                    :title="selectedWork.title"
                    sandbox="allow-scripts allow-same-origin allow-popups"
                    loading="lazy"
                  ></iframe>
                  <!-- 无链接时，展示作品图片集 -->
                  <div v-else class="viewport-gallery">
                    <div class="gallery-slides" :style="{ transform: `translateX(-${galleryIndex * 100}%)` }">
                      <div v-for="(img, i) in getWorkImages(selectedWork)" :key="i" class="gallery-slide">
                        <img :src="img" :alt="`${selectedWork.title} - ${i + 1}`" />
                      </div>
                    </div>
                    <div v-if="getWorkImages(selectedWork).length > 1" class="gallery-nav">
                      <button class="gallery-btn" @click="galleryPrev" :disabled="galleryIndex === 0">
                        <ChevronLeft :size="16" />
                      </button>
                      <span class="gallery-indicator">{{ galleryIndex + 1 }} / {{ getWorkImages(selectedWork).length }}</span>
                      <button class="gallery-btn" @click="galleryNext" :disabled="galleryIndex === getWorkImages(selectedWork).length - 1">
                        <ChevronRight :size="16" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 底部信息栏 -->
              <div class="preview-footer">
                <div class="preview-meta">
                  <h3 class="preview-title">{{ selectedWork.title }}</h3>
                  <p class="preview-desc">{{ selectedWork.description }}</p>
                </div>
                <div class="preview-actions">
                  <a v-if="selectedWork.link" :href="selectedWork.link" target="_blank" class="action-btn primary" @click.stop>
                    <ExternalLink :size="15" />
                    访问
                  </a>
                  <a v-if="selectedWork.github" :href="selectedWork.github" target="_blank" class="action-btn outline" @click.stop>
                    <Github :size="15" />
                    源码
                  </a>
                </div>
              </div>
            </div>
            <div v-else class="preview-empty">
              <Monitor :size="48" />
              <p>选择作品查看预览</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats-section">
      <div class="container">
        <div class="stats-content">
          <div class="stats-info">
            <h2 class="stats-title">数据统计</h2>
            <p class="stats-desc">持续输出高质量内容，记录成长轨迹</p>
            <div class="stats-grid">
              <div class="stat-item">
                <FileText :size="28" class="stat-icon" />
                <div class="stat-content">
                  <div class="stat-number">{{ articles.length }}+</div>
                  <div class="stat-label">篇文章</div>
                </div>
              </div>
              <div class="stat-item">
                <FolderOpen :size="28" class="stat-icon" />
                <div class="stat-content">
                  <div class="stat-number">{{ works.length }}+</div>
                  <div class="stat-label">个作品</div>
                </div>
              </div>
              <div class="stat-item">
                <Calendar :size="28" class="stat-icon" />
                <div class="stat-content">
                  <div class="stat-number">5+</div>
                  <div class="stat-label">年经验</div>
                </div>
              </div>
            </div>
          </div>
          <div class="stats-chart-wrapper">
            <StatsChart />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { BookOpen, User, ArrowRight, ChevronDown, ChevronRight, ChevronLeft, FileText, FolderOpen, Calendar, ExternalLink, Github, Lock, Monitor } from 'lucide-vue-next'
import { useBlogStore } from '@/store'
import ArticleCard from '@/components/article/ArticleCard.vue'
import WorkCard from '@/components/work/WorkCard.vue'
import StatsChart from '@/components/home/StatsChart.vue'
import type { Work } from '@/types'

const blogStore = useBlogStore()

// 首页加载时拉取文章
onMounted(() => {
  blogStore.fetchArticles()
})

const profile = computed(() => blogStore.profileData)
const articles = computed(() => blogStore.allArticles)
const works = computed(() => blogStore.allWorks)
const featuredArticles = computed(() => blogStore.featuredArticles)
const featuredWorks = computed(() => blogStore.filteredWorks.slice(0, 3))

const selectedWork = ref<Work | null>(featuredWorks.value[0] || null)
const galleryIndex = ref(0)

// 获取作品的展示图片
const getWorkImages = (work: Work): string[] => {
  if (work.images && work.images.length > 0) return work.images
  return [work.cover]
}

const galleryPrev = () => {
  if (galleryIndex.value > 0) galleryIndex.value--
}

const galleryNext = () => {
  const work = selectedWork.value
  if (work && galleryIndex.value < getWorkImages(work).length - 1) galleryIndex.value++
}

// 切换作品时重置
import { watch } from 'vue'
watch(selectedWork, () => {
  galleryIndex.value = 0
})

const getParticleStyle = (index: number) => {
  const size = Math.random() * 4 + 2
  const left = Math.random() * 100
  const delay = Math.random() * 5
  const duration = Math.random() * 10 + 10

  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${left}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`
  }
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
}

/* Hero Section */
.hero-section {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 40px 0 80px;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.hero-gradient {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at top right, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
              radial-gradient(ellipse at bottom left, rgba(37, 99, 235, 0.08) 0%, transparent 50%);
}

.hero-particles {
  position: absolute;
  inset: 0;
}

.particle {
  position: absolute;
  bottom: -10px;
  background: var(--primary-color);
  border-radius: 50%;
  opacity: 0.3;
  animation: float-up linear infinite;
}

@keyframes float-up {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 0.3;
  }
  90% {
    opacity: 0.3;
  }
  100% {
    transform: translateY(-100vh) rotate(720deg);
    opacity: 0;
  }
}

.hero-content {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: center;
}

.hero-text {
  max-width: 600px;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 16px;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: var(--text-secondary);
  margin-bottom: 16px;
}

.hero-description {
  font-size: 1rem;
  color: var(--text-tertiary);
  line-height: 1.8;
  margin-bottom: 32px;
}

.hero-actions {
  display: flex;
  gap: 16px;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: var(--radius-lg);
  font-weight: 500;
  font-size: 0.9375rem;
  transition: all var(--transition-normal);
}

.btn-primary {
  background: var(--primary-gradient);
  color: white;
  box-shadow: 0 4px 14px rgba(59, 130, 246, 0.35);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.45);
  color: white;
}

.btn-secondary {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background: var(--bg-tertiary);
  transform: translateY(-2px);
  color: var(--text-primary);
}

.hero-visual {
  display: flex;
  justify-content: center;
}

.hero-avatar-wrapper {
  position: relative;
  width: 320px;
  height: 320px;
  background: var(--bg-secondary);
  border-radius: 50%;
}

.hero-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  box-shadow: var(--shadow-xl);
  position: relative;
  z-index: 1;
}

.avatar-ring {
  position: absolute;
  inset: -8px;
  border-radius: 50%;
  border: 3px solid transparent;
  background: linear-gradient(white, white) padding-box,
              var(--primary-gradient) border-box;
  animation: rotate 10s linear infinite;
  z-index: 0;
  pointer-events: none;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.scroll-indicator {
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  color: var(--text-tertiary);
  z-index: 10;
  cursor: pointer;
  padding: 8px;
  animation: bounce 2s infinite;
  opacity: 0.6;
}

.scroll-indicator:hover {
  opacity: 1;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateX(-50%) translateY(0);
  }
  40% {
    transform: translateX(-50%) translateY(-10px);
  }
  60% {
    transform: translateX(-50%) translateY(-5px);
  }
}

/* Sections */
.featured-section,
.works-section {
  padding: 80px 0;
}

.works-section {
  background: var(--bg-secondary);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.section-title {
  font-size: 2rem;
  font-weight: 600;
}

.view-all {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.9375rem;
  color: var(--primary-color);
  font-weight: 500;
}

.view-all:hover {
  color: var(--secondary-color);
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

/* Works Showcase */
.works-showcase {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 24px;
  align-items: start;
}

/* 左侧选择列表 */
.works-selector {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.work-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all 0.25s ease;
  border: 2px solid transparent;
  background: var(--bg-primary);
}

.work-item:hover {
  background: var(--bg-secondary);
  transform: translateX(4px);
}

.work-item.active {
  border-color: var(--primary-color);
  background: var(--bg-primary);
  box-shadow: 0 2px 12px rgba(59, 130, 246, 0.12);
}

.work-item-thumb {
  width: 64px;
  height: 48px;
  border-radius: var(--radius-md);
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: var(--shadow-sm);
}

.work-item-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.work-item-info {
  flex: 1;
  min-width: 0;
}

.work-item-category {
  font-size: 0.6875rem;
  font-weight: 600;
  color: var(--primary-color);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.work-item-title {
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 2px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.work-item-desc {
  font-size: 0.75rem;
  color: var(--text-tertiary);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.work-item-tags {
  display: flex;
  gap: 4px;
  margin-top: 4px;
}

.mini-tag {
  padding: 1px 6px;
  background: var(--bg-secondary);
  border-radius: var(--radius-full);
  font-size: 0.625rem;
  color: var(--text-tertiary);
}

.work-item-arrow {
  color: var(--text-tertiary);
  flex-shrink: 0;
  opacity: 0;
  transition: all 0.25s ease;
}

.work-item:hover .work-item-arrow,
.work-item.active .work-item-arrow {
  opacity: 1;
  color: var(--primary-color);
}

/* 右侧预览区 */
.works-preview {
  position: sticky;
  top: 80px;
  border-radius: var(--radius-xl);
  overflow: hidden;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-md);
}

.preview-content {
  display: flex;
  flex-direction: column;
}

/* 浏览器窗口 */
.preview-browser {
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  overflow: hidden;
}

.browser-toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  background: #1e1e2e;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.browser-dots {
  display: flex;
  gap: 7px;
}

.browser-dots .dot {
  width: 11px;
  height: 11px;
  border-radius: 50%;
}

.browser-dots .dot:nth-child(1) { background: #ff5f57; }
.browser-dots .dot:nth-child(2) { background: #febc2e; }
.browser-dots .dot:nth-child(3) { background: #28c840; }

.browser-address {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 14px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-full);
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.75rem;
  min-width: 0;
}

.address-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.browser-actions {
  display: flex;
  gap: 6px;
}

.browser-action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: var(--radius-md);
  color: rgba(255, 255, 255, 0.5);
  transition: all 0.2s ease;
}

.browser-action-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.browser-viewport {
  height: 420px;
  background: #f5f5f5;
  overflow: hidden;
}

.browser-viewport iframe {
  width: 100%;
  height: 100%;
  border: none;
  background: white;
}

.viewport-gallery {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.gallery-slides {
  width: 100%;
  height: 100%;
  display: flex;
  transition: transform 0.4s ease;
}

.gallery-slide {
  min-width: 100%;
  height: 100%;
  flex-shrink: 0;
}

.gallery-slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.gallery-nav {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 16px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  border-radius: var(--radius-full);
  z-index: 10;
}

.gallery-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border: none;
  cursor: pointer;
  transition: background 0.2s ease;
}

.gallery-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.3);
}

.gallery-btn:disabled {
  opacity: 0.3;
  cursor: default;
}

.gallery-indicator {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.8);
  font-variant-numeric: tabular-nums;
  min-width: 40px;
  text-align: center;
}

/* 底部信息栏 */
.preview-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-top: 1px solid var(--border-color);
  background: var(--bg-primary);
}

.preview-meta {
  min-width: 0;
  flex: 1;
}

.preview-title {
  font-family: var(--font-body);
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 2px;
}

.preview-desc {
  font-size: 0.8125rem;
  color: var(--text-tertiary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.preview-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
  margin-left: 16px;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 7px 14px;
  border-radius: var(--radius-lg);
  font-size: 0.8125rem;
  font-weight: 500;
  transition: all 0.25s ease;
  white-space: nowrap;
}

.action-btn.primary {
  background: var(--primary-gradient);
  color: white;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.action-btn.primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
  color: white;
}

.action-btn.outline {
  background: var(--bg-primary);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
}

.action-btn.outline:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.preview-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 420px;
  gap: 12px;
  color: var(--text-tertiary);
}

.preview-empty p {
  font-size: 0.9375rem;
}

/* Stats Section */
.stats-section {
  padding: 80px 0;
  background: var(--bg-secondary);
}

.stats-content {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 48px;
  align-items: stretch;
}

.stats-info {
  display: flex;
  flex-direction: column;
}

.stats-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 12px;
  color: var(--text-primary);
}

.stats-desc {
  font-size: 1rem;
  color: var(--text-tertiary);
  margin-bottom: 32px;
}

.stats-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  transition: all var(--transition-fast);
  flex: 1;
}

.stat-item:hover {
  transform: translateX(8px);
  box-shadow: var(--shadow-md);
}

.stat-icon {
  color: var(--primary-color);
  flex-shrink: 0;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.2;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-tertiary);
}

.stats-chart-wrapper {
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  padding: 24px;
  box-shadow: var(--shadow-sm);
  margin-top: 52px;
  display: flex;
  flex-direction: column;
}

/* Responsive */
@media (max-width: 1024px) {
  .hero-content {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .hero-text {
    max-width: 100%;
  }

  .hero-actions {
    justify-content: center;
  }

  .hero-visual {
    order: -1;
  }

  .hero-avatar-wrapper {
    width: 240px;
    height: 240px;
  }

  .articles-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .works-showcase {
    grid-template-columns: 1fr;
  }

  .works-selector {
    flex-direction: row;
    overflow-x: auto;
    padding-bottom: 8px;
    gap: 12px;
  }

  .work-item {
    min-width: 220px;
    flex-shrink: 0;
  }

  .works-preview {
    position: static;
  }

  .stats-content {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .stats-grid {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .stat-item {
    flex: 1;
    min-width: 140px;
  }

  .stats-chart-wrapper {
    margin-top: 0;
    height: auto;
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .articles-grid {
    grid-template-columns: 1fr;
  }

  .works-showcase {
    grid-template-columns: 1fr;
  }

  .works-selector {
    flex-direction: row;
    overflow-x: auto;
    padding-bottom: 8px;
    gap: 10px;
  }

  .work-item {
    min-width: 200px;
    flex-shrink: 0;
  }

  .browser-viewport {
    height: 280px;
  }

  .preview-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .preview-actions {
    margin-left: 0;
  }

  .stats-grid {
    flex-direction: column;
  }

  .stat-item {
    min-width: 100%;
  }

  .stat-number {
    font-size: 1.25rem;
  }

  .stats-chart-wrapper {
    margin-top: 0;
    height: auto;
  }
}
</style>
