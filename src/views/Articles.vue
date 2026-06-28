<template>
  <div class="articles-page">
    <div class="container">
      <!-- Top Section: Heatmap + Music Player -->
      <div class="top-section">
        <div class="heatmap-wrapper">
          <ActivityHeatmap />
        </div>
        <div class="tree-wrapper">
          <SeasonTree />
        </div>
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
      <template v-if="filteredArticles.length > 0">
        <div class="articles-grid">
          <ArticleCard
            v-for="(article, index) in paginatedArticles"
            :key="article.id"
            :article="article"
            :style="{ animationDelay: `${index * 0.05}s` }"
            class="animate-fade-in-up"
          />
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="pagination">
          <button class="page-btn" :disabled="currentPage === 1" @click="currentPage = 1">
            <ChevronsLeft :size="16" />
          </button>
          <button class="page-btn" :disabled="currentPage === 1" @click="currentPage--">
            <ChevronLeft :size="16" />
          </button>
          <template v-for="page in displayedPages" :key="page">
            <span v-if="page === '...'" class="page-ellipsis">...</span>
            <button
              v-else
              class="page-btn"
              :class="{ active: currentPage === page }"
              @click="currentPage = page as number"
            >
              {{ page }}
            </button>
          </template>
          <button class="page-btn" :disabled="currentPage === totalPages" @click="currentPage++">
            <ChevronRight :size="16" />
          </button>
          <button class="page-btn" :disabled="currentPage === totalPages" @click="currentPage = totalPages">
            <ChevronsRight :size="16" />
          </button>
        </div>
      </template>

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
import { computed, ref, watch, onMounted } from 'vue'
import { Search, FileQuestion, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-vue-next'
import { useBlogStore } from '@/store'
import ArticleCard from '@/components/article/ArticleCard.vue'
import ActivityHeatmap from '@/components/article/ActivityHeatmap.vue'
import SeasonTree from '@/components/article/SeasonTree.vue'

const blogStore = useBlogStore()
const currentPage = ref(1)
const pageSize = 8

// 组件加载时先拉分类，再拉文章（分类映射需要先就绪）
onMounted(async () => {
  await blogStore.fetchCategories(1)
  blogStore.fetchArticles()
})

const categories = computed(() => blogStore.articleCategories)
const currentCategory = computed(() => blogStore.currentArticleCategory)
const searchQuery = computed({
  get: () => blogStore.searchQuery,
  set: (value) => blogStore.setSearchQuery(value)
})
const filteredArticles = computed(() => blogStore.filteredArticles)

const totalPages = computed(() => Math.ceil(filteredArticles.value.length / pageSize))

const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredArticles.value.slice(start, start + pageSize)
})

const displayedPages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const pages: (number | string)[] = []

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    pages.push(1)
    if (current > 3) pages.push('...')
    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)
    for (let i = start; i <= end; i++) pages.push(i)
    if (current < total - 2) pages.push('...')
    pages.push(total)
  }

  return pages
})

const setCategory = (category: string) => {
  blogStore.setCategory(category)
  currentPage.value = 1
}

watch(searchQuery, () => {
  currentPage.value = 1
})
</script>

<style scoped>
.articles-page {
  padding: 48px 0 80px;
  min-height: calc(100vh - 64px);
}

.top-section {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  margin-bottom: 32px;
}

.heatmap-wrapper {
  height: 100%;
}

.tree-wrapper {
  height: 100%;
}

.filters-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 32px 0;
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
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
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

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  margin-top: 40px;
}

.page-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 36px;
  padding: 0 8px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--bg-primary);
  color: var(--text-secondary);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.page-btn:hover:not(:disabled):not(.active) {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.page-btn.active {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-ellipsis {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 36px;
  color: var(--text-tertiary);
  font-size: 0.875rem;
}

@media (max-width: 1024px) {
  .top-section {
    grid-template-columns: 1fr;
  }

  .articles-grid {
    grid-template-columns: repeat(3, 1fr);
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
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
