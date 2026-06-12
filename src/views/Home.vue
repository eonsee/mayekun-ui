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
        <div class="works-grid">
          <WorkCard
            v-for="(work, index) in featuredWorks"
            :key="work.id"
            :work="work"
            :style="{ animationDelay: `${index * 0.1}s` }"
            class="animate-fade-in-up"
          />
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats-section">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-number">{{ articles.length }}+</div>
            <div class="stat-label">篇文章</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ works.length }}+</div>
            <div class="stat-label">个作品</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">5+</div>
            <div class="stat-label">年经验</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">10K+</div>
            <div class="stat-label">次阅读</div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { BookOpen, User, ArrowRight, ChevronDown } from 'lucide-vue-next'
import { useBlogStore } from '@/store'
import ArticleCard from '@/components/article/ArticleCard.vue'
import WorkCard from '@/components/work/WorkCard.vue'

const blogStore = useBlogStore()

const profile = computed(() => blogStore.profileData)
const articles = computed(() => blogStore.allArticles)
const works = computed(() => blogStore.allWorks)
const featuredArticles = computed(() => blogStore.featuredArticles)
const featuredWorks = computed(() => blogStore.filteredWorks.slice(0, 3))

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

.articles-grid,
.works-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

/* Stats Section */
.stats-section {
  padding: 80px 0;
  background: var(--primary-gradient);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
}

.stat-item {
  text-align: center;
  color: white;
}

.stat-number {
  font-family: var(--font-display);
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 1rem;
  opacity: 0.9;
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

  .articles-grid,
  .works-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 48px;
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .articles-grid,
  .works-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .stat-number {
    font-size: 2.5rem;
  }
}
</style>
