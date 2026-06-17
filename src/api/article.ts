import request, { type PageResult, type PageParam } from './request'

// 文章 VO 类型（对应后端 BArticleVO）
export interface ArticleVO {
  id: number
  title: string
  summary: string
  content: string
  cover: string
  categoryId: number
  author: string
  readTime: number
  views: number
  likeCount: number
  commenbCount: number
  isTop: number
  isRecommend: number
  status: number
  sort: number
  createTime: string
  userId: number
}

// 文章查询表单（对应后端 BArticleQueryForm）
export interface ArticleQueryForm extends PageParam {
  keywords?: string
}

// 热力图数据项（对应后端 HeatMapVO）
export interface HeatMapVO {
  date: string
  count: number
}

export const articleApi = {
  /** 分页查询文章（博客公开接口） */
  queryPage: (params: ArticleQueryForm) => {
    return request.post<unknown, PageResult<ArticleVO>>('/api/web/bArticle/queryPage', params)
  },

  /** 获取文章详情（博客公开接口） */
  getDetail: (id: number) => {
    return request.get<unknown, ArticleVO>(`/api/web/bArticle/get/${id}`)
  },

  /** 获取热力图数据（过去一年每天发布的文章数量） */
  getHeatMap: () => {
    return request.get<unknown, HeatMapVO[]>('/api/web/bArticle/heatMap')
  },
}
