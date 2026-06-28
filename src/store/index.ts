import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Article, Work, Profile, Category } from '@/types'
import { articles as mockArticles, works, profile, categories } from '@/mock/data'
import { articleApi, type ArticleVO, type HeatMapVO } from '@/api/article'
import { profileApi, type ProfileVO } from '@/api/profile'
import { skillApi, type SkillVO } from '@/api/skill'
import { growthApi, type GrowthTimelineVO } from '@/api/growth'
import { categoryApi, type CategoryVO } from '@/api/category'
import { workApi, type WorkVO } from '@/api/work'
import { resolveUrl } from '@/api/request'

function getDefaultSeason(): 'spring' | 'summer' | 'autumn' | 'winter' {
  const month = new Date().getMonth() + 1
  if (month >= 3 && month <= 5) return 'spring'
  if (month >= 6 && month <= 8) return 'summer'
  if (month >= 9 && month <= 11) return 'autumn'
  return 'winter'
}

// 后端 VO 转前端 Article 类型（通过 categoryId 映射分类名称）
function voToArticle(vo: ArticleVO, categoryMap: Map<number, string>): Article {
  return {
    id: String(vo.id),
    title: vo.title || '',
    summary: vo.summary || '',
    content: vo.content || '',
    cover: resolveUrl(vo.cover),
    category: categoryMap.get(vo.categoryId) || '',
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
    avatar: resolveUrl(vo.avatar),
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

// 后端分类 VO 转前端 Category 类型
function voToCategory(vo: CategoryVO): Category {
  return {
    id: String(vo.id),
    name: vo.name || '',
    count: 0, // 后端暂无文章数量统计
  }
}

// 后端作品 VO 转前端 Work 类型（通过 categoryId 映射分类名称）
function voToWork(vo: WorkVO, categoryMap: Map<number, string>): Work {
  let images: string[] = []
  if (vo.images) {
    try {
      images = JSON.parse(vo.images).map((url: string) => resolveUrl(url))
    } catch {
      images = []
    }
  }
  return {
    id: String(vo.id),
    title: vo.title || '',
    description: vo.description || '',
    cover: resolveUrl(vo.cover),
    images,
    category: categoryMap.get(vo.categoryId) || '',
    tags: [],
    link: vo.link || '',
    github: vo.github || undefined,
    createdAt: vo.createTime || '',
  }
}

export const useBlogStore = defineStore('blog', () => {
  // 文章：优先使用 API 数据，失败时 fallback 到 mock
  const allArticles = ref<Article[]>(mockArticles)
  const allWorks = ref<Work[]>(works)
  const profileData = ref<Profile>(profile)
  // 原始分类数据（从后端拉取，不含"全部"）
  const rawArticleCategories = ref<Category[]>(categories.filter(c => c.name !== '全部'))
  const rawWorkCategories = ref<Category[]>([])
  const currentArticleCategory = ref<string>('全部')
  const currentWorkCategory = ref<string>('全部')
  const searchQuery = ref<string>('')
  const currentSeason = ref<'spring' | 'summer' | 'autumn' | 'winter'>(getDefaultSeason())
  const articleLoading = ref(false)
  const heatMapData = ref<HeatMapVO[]>([])
  const heatMapLoading = ref(false)
  const growthTimelineData = ref<GrowthTimelineVO[]>([])

  // 构建 categoryId → name 映射表
  const buildCategoryMap = (cats: Category[]): Map<number, string> => {
    const map = new Map<number, string>()
    for (const cat of cats) {
      if (cat.id !== '0') map.set(Number(cat.id), cat.name)
    }
    return map
  }

  // 从后端拉取文章列表
  const fetchArticles = async (pageNum = 1, pageSize = 50) => {
    articleLoading.value = true
    try {
      const result = await articleApi.queryPage({ pageNum, pageSize, searchCount: true })
      if (result && result.list && result.list.length > 0) {
        const categoryMap = buildCategoryMap(rawArticleCategories.value)
        allArticles.value = result.list.map(vo => voToArticle(vo, categoryMap))
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
        const categoryMap = buildCategoryMap(rawArticleCategories.value)
        return voToArticle(vo, categoryMap)
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

  // 从后端拉取分类列表（type=1 文章分类，type=2 作品分类）
  const fetchCategories = async (type?: number) => {
    try {
      const result = await categoryApi.queryPage({ pageNum: 1, pageSize: 100, searchCount: true, type })
      if (result && result.list && result.list.length > 0) {
        if (type === 2) {
          rawWorkCategories.value = result.list.map(voToCategory)
        } else {
          rawArticleCategories.value = result.list.map(voToCategory)
        }
      }
    } catch (e) {
      console.warn('[Store] 分类接口请求失败，使用本地数据', e)
    }
  }

  // 从后端拉取作品列表
  const fetchWorks = async (pageNum = 1, pageSize = 50) => {
    try {
      const result = await workApi.queryPage({ pageNum, pageSize, searchCount: true })
      if (result && result.list && result.list.length > 0) {
        const categoryMap = buildCategoryMap(rawWorkCategories.value)
        allWorks.value = result.list.map(vo => voToWork(vo, categoryMap))
      }
    } catch (e) {
      console.warn('[Store] 作品接口请求失败，使用本地数据', e)
    }
  }

  // 文章分类：根据实际文章数据计算 count，过滤掉 count=0 的分类，前面加"全部"
  const articleCategories = computed<Category[]>(() => {
    const counted = rawArticleCategories.value.map(cat => ({
      ...cat,
      count: allArticles.value.filter(a => a.category === cat.name).length,
    })).filter(cat => cat.count > 0)
    return [{ id: '0', name: '全部', count: allArticles.value.length }, ...counted]
  })

  // 作品分类：根据实际作品数据计算 count，过滤掉 count=0 的分类，前面加"全部"
  const workCategories = computed<Category[]>(() => {
    const counted = rawWorkCategories.value.map(cat => ({
      ...cat,
      count: allWorks.value.filter(w => w.category === cat.name).length,
    })).filter(cat => cat.count > 0)
    return [{ id: '0', name: '全部', count: allWorks.value.length }, ...counted]
  })

  // 获取文章列表
  const filteredArticles = computed(() => {
    let result = allArticles.value

    // 按分类筛选
    if (currentArticleCategory.value !== '全部') {
      result = result.filter(article => article.category === currentArticleCategory.value)
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

  // 获取作品列表（按分类筛选）
  const filteredWorks = computed(() => {
    if (currentWorkCategory.value === '全部') return allWorks.value
    return allWorks.value.filter(work => work.category === currentWorkCategory.value)
  })

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
    currentArticleCategory.value = category
  }

  // 设置当前作品分类
  const setWorkCategory = (category: string) => {
    currentWorkCategory.value = category
  }

  // 设置搜索词
  const setSearchQuery = (query: string) => {
    searchQuery.value = query
  }

  return {
    allArticles,
    allWorks,
    profileData,
    articleCategories,
    workCategories,
    currentArticleCategory,
    currentWorkCategory,
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
    fetchCategories,
    fetchWorks,
    getArticleById,
    getWorkById,
    getRelatedArticles,
    getPrevNextArticles,
    setCategory,
    setWorkCategory,
    setSearchQuery
  }
})
