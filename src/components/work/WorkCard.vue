<template>
  <div class="work-card" :class="{ active: active }" @click="$emit('select')">
    <div class="card-image">
      <img :src="work.cover" :alt="work.title" loading="lazy" />
      <div class="card-overlay">
        <a v-if="work.link" :href="work.link" target="_blank" class="overlay-btn" @click.stop>
          <ExternalLink :size="18" />
          访问
        </a>
        <a v-if="work.github" :href="work.github" target="_blank" class="overlay-btn" @click.stop>
          <Github :size="18" />
          源码
        </a>
      </div>
    </div>
    <div class="card-content">
      <div class="card-category">{{ work.category }}</div>
      <h3 class="card-title">{{ work.title }}</h3>
      <p class="card-description">{{ work.description }}</p>
      <div class="card-tags">
        <span v-for="tag in work.tags.slice(0, 3)" :key="tag" class="tag">
          {{ tag }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ExternalLink, Github } from 'lucide-vue-next'
import type { Work } from '@/types'

defineProps<{
  work: Work
  active?: boolean
}>()

defineEmits<{
  select: []
}>()
</script>

<style scoped>
.work-card {
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  overflow: hidden;
  border: 1px solid var(--border-color);
  transition: all var(--transition-normal);
}

.work-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: transparent;
}

.work-card.active {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.card-image {
  position: relative;
  aspect-ratio: 16 / 10;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.work-card:hover .card-image img {
  transform: scale(1.05);
}

.card-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  opacity: 0;
  transition: opacity var(--transition-normal);
}

.work-card:hover .card-overlay {
  opacity: 1;
}

.overlay-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  background: white;
  color: var(--text-primary);
  border-radius: var(--radius-lg);
  font-size: 0.875rem;
  font-weight: 500;
  transition: all var(--transition-fast);
}

.overlay-btn:hover {
  background: var(--primary-color);
  color: white;
}

.card-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.card-category {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--primary-color);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.card-title {
  font-family: var(--font-body);
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
}

.card-description {
  font-size: 0.875rem;
  color: var(--text-tertiary);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 4px;
}

.tag {
  padding: 4px 10px;
  background: var(--bg-secondary);
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  color: var(--text-secondary);
}
</style>
