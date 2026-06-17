import request, { type PageResult, type PageParam } from './request'

// 技能 VO 类型（对应后端 BSkillVO）
export interface SkillVO {
  id: number
  name: string
  level: number
  category: string
  icon: string
  url: string
  sort: number
  status: number
  createTime: string
}

// 技能查询表单（对应后端 BSkillQueryForm）
export interface SkillQueryForm extends PageParam {
  keywords?: string
}

export const skillApi = {
  /** 分页查询技能（博客公开接口） */
  queryPage: (params: SkillQueryForm) => {
    return request.post<unknown, PageResult<SkillVO>>('/api/web/bSkill/queryPage', params)
  },

  /** 获取技能详情（博客公开接口） */
  getDetail: (id: number) => {
    return request.get<unknown, SkillVO>(`/api/web/bSkill/detail/${id}`)
  },
}
