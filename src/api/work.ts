import request, { type PageResult, type PageParam } from './request'

// 作品 VO 类型（对应后端 BWorkVO）
export interface WorkVO {
  id: number
  title: string
  description: string
  cover: string
  images: string
  categoryId: number
  link: string
  github: string
  views: number
  likeCount: number
  isRecommend: number
  status: number
  sort: number
  createTime: string
  userId: number
}

// 作品查询表单
export interface WorkQueryForm extends PageParam {
  keywords?: string
}

export const workApi = {
  /** 分页查询作品（博客公开接口） */
  queryPage: (params: WorkQueryForm) => {
    return request.post<unknown, PageResult<WorkVO>>('/api/web/bWork/queryPage', params)
  },

  /** 获取作品详情（博客公开接口） */
  getDetail: (id: number) => {
    return request.get<unknown, WorkVO>(`/api/web/bWork/detail/${id}`)
  },
}
