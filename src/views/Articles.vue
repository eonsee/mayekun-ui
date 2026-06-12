<template>
  <div class="articles-page">
    <div class="container">
      <!-- Page Header -->
      <div class="page-header">
        <h1 class="page-title">文章</h1>
        <p class="page-subtitle">探索技术世界，分享学习心得</p>
      </div>

      <!-- Filters -->
      <div class="filters-section">
        <div class="category-tabs">
          <button
            v-for="category in categories"
            :key="category.id"
            class="category-tab"
            :class="{ active: currentCategory === category.name }"
            @click="setCategory(category.name)"
          >
            {{ category.name }}
            <span class="count">{{ category.count }}</span>
          </button>
        </div>
        <div class="search-box">
          <Search :size="18" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索文章..."
            class="search-input"
          />
        </div>
      </div>

      <!-- Articles Grid -->
      <div v-if="filteredArticles.length > 0" class="articles-grid">
        <ArticleCard
          v-for="(article, index) in filteredArticles"
          :key="article.id"
          :article="article"
          :style="{ animationDelay: `${index * 0.05}s` }"
          class="animate-fade-in-up"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <FileQuestion :size="64" />
        <h3>没有找到相关文章</h3>
        <p>尝试更换关键词或分类</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Search, FileQuestion } from 'lucide-vue-next'
import { useBlogStore } from '@/store'
import ArticleCard from '@/components/article/ArticleCard.vue'

const blogStore = useBlogStore()

const categories = computed(() => blogStore.allCategories)
const currentCategory = computed(() => blogStore.currentCategory)
const searchQuery = computed({
  get: () => blogStore.searchQuery,
  set: (value) => blogStore.setSearchQuery(value)
})
const filteredArticles = computed(() => blogStore.filteredArticles)

const setCategory = (category: string) => {
  blogStore.setCategory(category)
}
</script>

<style scoped>
.articles-page {
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

.filters-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  flex-wrap: wrap;
  gap: 16px;
}

.category-tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.category-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: var(--bg-secondary);
  border-radius: var(--radius-full);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
  transition: all var(--transition-fast);
}

.category-tab:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.category-tab.active {
  background: var(--primary-gradient);
  color: white;
}

.category-tab .count {
  padding: 2px 6px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: var(--radius-full);
  font-size: 0.75rem;
}

.category-tab.active .count {
  background: rgba(255, 255, 255, 0.2);
}

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: var(--bg-secondary);
  border-radius: var(--radius-full);
  min-width: 240px;
}

.search-box svg {
  color: var(--text-tertiary);
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 0.875rem;
  color: var(--text-primary);
  outline: none;
}

.search-input::placeholder {
  color: var(--text-tertiary);
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: var(--text-tertiary);
}

.empty-state svg {
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-state h3 {
  font-size: 1.25rem;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

@media (max-width: 1024px) {
  .articles-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .filters-section {
    flex-direction: column;
    align-items: stretch;
  }

  .category-tabs {
    overflow-x: auto;
    flex-wrap: nowrap;
    padding-bottom: 8px;
  }

  .search-box {
    min-width: 100%;
  }

  .articles-grid {
    grid-template-columns: 1fr;
  }
}
</style>
