<template>
  <div class="works-page">
    <div class="container">
      <!-- Page Header -->
      <div class="page-header">
        <h1 class="page-title">作品展示</h1>
        <p class="page-subtitle">探索我的项目与创作</p>
      </div>

      <!-- Works Grid -->
      <div class="works-grid">
        <WorkCard
          v-for="(work, index) in works"
          :key="work.id"
          :work="work"
          :style="{ animationDelay: `${index * 0.1}s` }"
          class="animate-fade-in-up"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useBlogStore } from '@/store'
import WorkCard from '@/components/work/WorkCard.vue'

const blogStore = useBlogStore()

const works = computed(() => blogStore.filteredWorks)
</script>

<style scoped>
.works-page {
  padding: 48px 0 80px;
  min-height: calc(100vh - 64px);
}

.page-header {
  text-align: center;
  margin-bottom: 48px;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 12px;
}

.page-subtitle {
  font-size: 1.125rem;
  color: var(--text-tertiary);
}

.works-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

@media (max-width: 1024px) {
  .works-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .works-grid {
    grid-template-columns: 1fr;
  }
}
</style>
