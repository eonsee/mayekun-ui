import request, { type PageResult, type PageParam } from './request'

// 分类 VO 类型（对应后端 BCategoryVO）
export interface CategoryVO {
  id: number
  name: string
  code: string
  type: number
  parenbId: number
  sort: number
  status: number
  createTime: string
}

// 分类查询表单
export interface CategoryQueryForm extends PageParam {
  keywords?: string
  type?: number
}

export const categoryApi = {
  /** 分页查询分类（博客公开接口） */
  queryPage: (params: CategoryQueryForm) => {
    return request.post<unknown, PageResult<CategoryVO>>('/api/web/bCategory/queryPage', params)
  },

  /** 获取分类详情（博客公开接口） */
  getDetail: (id: number) => {
    return request.get<unknown, CategoryVO>(`/api/web/bCategory/detail/${id}`)
  },
}
