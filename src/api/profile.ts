import request from './request'

// 个人信息 VO 类型（对应后端 BProfileVO）
export interface ProfileVO {
  id: number
  name: string
  avatar: string
  bio: string
  title: string
  location: string
  email: string
  phone: string
  wechat: string
  qq: string
  github: string
  twitter: string
  linkedin: string
  weibo: string
  gitee: string
  juejin: string
  website: string
  resumeUrl: string
  createTime: string
}

export const profileApi = {
  /** 获取个人信息详情（博客公开接口） */
  getDetail: (id: number = 1) => {
    return request.get<unknown, ProfileVO>(`/api/web/bProfile/detail/${id}`)
  },
}
