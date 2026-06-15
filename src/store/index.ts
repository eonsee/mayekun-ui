import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Article, Work, Profile, Category } from '@/types'
import { articles, works, profile, categories } from '@/mock/data'

function getDefaultSeason(): 'spring' | 'summer' | 'autumn' | 'winter' {
  const month = new Date().getMonth() + 1
  if (month >= 3 && month <= 5) return 'spring'
  if (month >= 6 && month <= 8) return 'summer'
  if (month >= 9 && month <= 11) return 'autumn'
  return 'winter'
}

export const useBlogStore = defineStore('blog', () => {
  const allArticles = ref<Article[]>(articles)
  const allWorks = ref<Work[]>(works)
  const profileData = ref<Profile>(profile)
  const allCategories = ref<Category[]>(categories)
  const currentCategory = ref<string>('全部')
  const searchQuery = ref<string>('')
  const currentSeason = ref<'spring' | 'summer' | 'autumn' | 'winter'>(getDefaultSeason())

  // 获取文章列表
  const filteredArticles = computed(() => {
    let result = allArticles.value

    // 按分类筛选
    if (currentCategory.value !== '全部') {
      result = result.filter(article => article.category === currentCategory.value)
    }

    // 按搜索词筛选
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      result = result.filter(article =>
        article.title.toLowerCase().includes(query) ||
        article.summary.toLowerCase().includes(query) ||
        article.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    return result
  })

  // 获取精选文章（前3篇）
  const featuredArticles = computed(() => allArticles.value.slice(0, 3))

  // 获取作品列表
  const filteredWorks = computed(() => allWorks.value)

  // 根据 ID 获取文章
  const getArticleById = (id: string): Article | undefined => {
    return allArticles.value.find(article => article.id === id)
  }

  // 根据 ID 获取作品
  const getWorkById = (id: string): Work | undefined => {
    return allWorks.value.find(work => work.id === id)
  }

  // 获取相关文章
  const getRelatedArticles = (currentId: string, limit: number = 3): Article[] => {
    const currentArticle = getArticleById(currentId)
    if (!currentArticle) return []

    return allArticles.value
      .filter(article => article.id !== currentId)
      .filter(article =>
        article.category === currentArticle.category ||
        article.tags.some(tag => currentArticle.tags.includes(tag))
      )
      .slice(0, limit)
  }

  // 获取上一篇和下一篇文章
  const getPrevNextArticles = (currentId: string): { prev: Article | null; next: Article | null } => {
    const currentIndex = allArticles.value.findIndex(article => article.id === currentId)
    
    if (currentIndex === -1) {
      return { prev: null, next: null }
    }

    return {
      prev: currentIndex > 0 ? allArticles.value[currentIndex - 1] : null,
      next: currentIndex < allArticles.value.length - 1 ? allArticles.value[currentIndex + 1] : null
    }
  }

  // 设置当前分类
  const setCategory = (category: string) => {
    currentCategory.value = category
  }

  // 设置搜索词
  const setSearchQuery = (query: string) => {
    searchQuery.value = query
  }

  return {
    allArticles,
    allWorks,
    profileData,
    allCategories,
    currentCategory,
    searchQuery,
    currentSeason,
    filteredArticles,
    featuredArticles,
    filteredWorks,
    getArticleById,
    getWorkById,
    getRelatedArticles,
    getPrevNextArticles,
    setCategory,
    setSearchQuery
  }
})
