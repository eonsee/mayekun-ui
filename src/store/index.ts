import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Article, Work, Profile, Category } from '@/types'
import { articles as mockArticles, works, profile, categories } from '@/mock/data'
import { articleApi, type ArticleVO, type HeatMapVO } from '@/api/article'
import { profileApi, type ProfileVO } from '@/api/profile'
import { skillApi, type SkillVO } from '@/api/skill'
import { growthApi, type GrowthTimelineVO } from '@/api/growth'

function getDefaultSeason(): 'spring' | 'summer' | 'autumn' | 'winter' {
  const month = new Date().getMonth() + 1
  if (month >= 3 && month <= 5) return 'spring'
  if (month >= 6 && month <= 8) return 'summer'
  if (month >= 9 && month <= 11) return 'autumn'
  return 'winter'
}

// 后端 VO 转前端 Article 类型
function voToArticle(vo: ArticleVO): Article {
  return {
    id: String(vo.id),
    title: vo.title || '',
    summary: vo.summary || '',
    content: vo.content || '',
    cover: vo.cover || '',
    category: '', // 后端暂无分类名称，由前端映射
    tags: [],     // 后端暂无标签
    author: vo.author || '',
    createdAt: vo.createTime || '',
    updatedAt: vo.createTime || '',
    readTime: vo.readTime || 0,
    views: vo.views || 0,
  }
}

// 后端 VO 转前端 Profile 类型
function voToProfile(vo: ProfileVO, currentSkills: Profile['skills']): Profile {
  return {
    name: vo.name || '',
    avatar: vo.avatar || '',
    bio: vo.bio || '',
    title: vo.title || '',
    location: vo.location || '',
    email: vo.email || '',
    social: {
      github: vo.github || undefined,
      twitter: vo.twitter || undefined,
      linkedin: vo.linkedin || undefined,
      weibo: vo.weibo || undefined,
      gitee: vo.gitee || undefined,
      juejin: vo.juejin || undefined,
    },
    skills: currentSkills,
  }
}

// 后端技能 VO 转前端 Profile skills 类型
function voToSkill(vo: SkillVO): Profile['skills'][0] {
  return {
    name: vo.name || '',
    icon: vo.icon || '',
    url: vo.url || undefined,
  }
}

export const useBlogStore = defineStore('blog', () => {
  // 文章：优先使用 API 数据，失败时 fallback 到 mock
  const allArticles = ref<Article[]>(mockArticles)
  const allWorks = ref<Work[]>(works)
  const profileData = ref<Profile>(profile)
  const allCategories = ref<Category[]>(categories)
  const currentCategory = ref<string>('全部')
  const searchQuery = ref<string>('')
  const currentSeason = ref<'spring' | 'summer' | 'autumn' | 'winter'>(getDefaultSeason())
  const articleLoading = ref(false)
  const heatMapData = ref<HeatMapVO[]>([])
  const heatMapLoading = ref(false)
  const growthTimelineData = ref<GrowthTimelineVO[]>([])

  // 从后端拉取文章列表
  const fetchArticles = async (pageNum = 1, pageSize = 50) => {
    articleLoading.value = true
    try {
      const result = await articleApi.queryPage({ pageNum, pageSize, searchCount: true })
      if (result && result.list && result.list.length > 0) {
        allArticles.value = result.list.map(voToArticle)
      }
    } catch (e) {
      console.warn('[Store] 文章列表接口请求失败，使用本地数据', e)
    } finally {
      articleLoading.value = false
    }
  }

  // 从后端拉取文章详情
  const fetchArticleDetail = async (id: string): Promise<Article | null> => {
    try {
      const vo = await articleApi.getDetail(Number(id))
      if (vo) {
        return voToArticle(vo)
      }
    } catch (e) {
      console.warn('[Store] 文章详情接口请求失败', e)
    }
    return null
  }

  // 从后端拉取热力图数据（过去一年每天发布的文章数量）
  const fetchHeatMapData = async () => {
    heatMapLoading.value = true
    try {
      const result = await articleApi.getHeatMap()
      if (result && Array.isArray(result)) {
        heatMapData.value = result
      }
    } catch (e) {
      console.warn('[Store] 热力图接口请求失败', e)
    } finally {
      heatMapLoading.value = false
    }
  }

  // 从后端拉取个人信息
  const fetchProfile = async (id: number = 1) => {
    try {
      const vo = await profileApi.getDetail(id)
      if (vo) {
        profileData.value = voToProfile(vo, profileData.value.skills)
      }
    } catch (e) {
      console.warn('[Store] 个人信息接口请求失败，使用本地数据', e)
    }
  }

  // 从后端拉取技能列表
  const fetchSkills = async (pageNum = 1, pageSize = 100) => {
    try {
      const result = await skillApi.queryPage({ pageNum, pageSize, searchCount: true })
      if (result && result.list && result.list.length > 0) {
        profileData.value = {
          ...profileData.value,
          skills: result.list.map(voToSkill),
        }
      }
    } catch (e) {
      console.warn('[Store] 技能接口请求失败，使用本地数据', e)
    }
  }

  // 从后端拉取成长轨迹
  const fetchGrowthTimeline = async (pageNum = 1, pageSize = 100) => {
    try {
      const result = await growthApi.queryPage({ pageNum, pageSize, searchCount: true })
      if (result && result.list && result.list.length > 0) {
        growthTimelineData.value = result.list
      }
    } catch (e) {
      console.warn('[Store] 成长轨迹接口请求失败', e)
    }
  }

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
    articleLoading,
    heatMapData,
    heatMapLoading,
    growthTimelineData,
    filteredArticles,
    featuredArticles,
    filteredWorks,
    fetchArticles,
    fetchArticleDetail,
    fetchHeatMapData,
    fetchProfile,
    fetchSkills,
    fetchGrowthTimeline,
    getArticleById,
    getWorkById,
    getRelatedArticles,
    getPrevNextArticles,
    setCategory,
    setSearchQuery
  }
})
