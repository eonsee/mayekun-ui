import request, { type PageResult, type PageParam } from './request'

// 成长轨迹 VO 类型（对应后端 BGrowthTimelineVO）
export interface GrowthTimelineVO {
  id: number
  year: number
  label: string
  description: string
  achievement: string
  color: string
  iconType: string
  isCurrent: number
  sort: number
  status: number
  createTime: string
}

// 成长轨迹查询表单（对应后端 BGrowthTimelineQueryForm）
export interface GrowthTimelineQueryForm extends PageParam {
  keywords?: string
}

export const growthApi = {
  /** 分页查询成长轨迹（博客公开接口） */
  queryPage: (params: GrowthTimelineQueryForm) => {
    return request.post<unknown, PageResult<GrowthTimelineVO>>('/api/web/bGrowthTimeline/queryPage', params)
  },

  /** 获取成长轨迹详情（博客公开接口） */
  getDetail: (id: number) => {
    return request.get<unknown, GrowthTimelineVO>(`/api/web/bGrowthTimeline/detail/${id}`)
  },
}
