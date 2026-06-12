<template>
  <router-link :to="`/article/${article.id}`" class="article-card">
    <div class="card-image">
      <img :src="article.cover" :alt="article.title" loading="lazy" />
      <div class="card-category">{{ article.category }}</div>
    </div>
    <div class="card-content">
      <h3 class="card-title">{{ article.title }}</h3>
      <p class="card-summary">{{ article.summary }}</p>
      <div class="card-meta">
        <div class="meta-item">
          <Calendar :size="14" />
          {{ article.createdAt }}
        </div>
        <div class="meta-item">
          <Clock :size="14" />
          {{ article.readTime }} 分钟
        </div>
        <div class="meta-item">
          <Eye :size="14" />
          {{ article.views }}
        </div>
      </div>
      <div class="card-tags">
        <span v-for="tag in article.tags.slice(0, 3)" :key="tag" class="tag">
          {{ tag }}
        </span>
      </div>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import { Calendar, Clock, Eye } from 'lucide-vue-next'
import type { Article } from '@/types'

defineProps<{
  article: Article
}>()
</script>

<style scoped>
.article-card {
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  overflow: hidden;
  border: 1px solid var(--border-color);
  transition: all var(--transition-normal);
}

.article-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: transparent;
}

.card-image {
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.article-card:hover .card-image img {
  transform: scale(1.05);
}

.card-category {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 4px 12px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--primary-color);
}

.card-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.card-title {
  font-family: var(--font-body);
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1.4;
  color: var(--text-primary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-summary {
  font-size: 0.875rem;
  color: var(--text-tertiary);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-meta {
  display: flex;
  gap: 16px;
  font-size: 0.8125rem;
  color: var(--text-tertiary);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.card-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  padding: 4px 10px;
  background: var(--bg-secondary);
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  color: var(--text-secondary);
}
</style>
