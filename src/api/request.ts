import axios, { type AxiosInstance, type AxiosResponse } from 'axios'

// SmartAdmin ResponseDTO 格式
export interface ResponseDTO<T = any> {
  code: number
  level: string | null
  ok: boolean
  msg: string
  data: T
  dataType: number
}

// SmartAdmin PageResult 格式
export interface PageResult<T = any> {
  pageNum: number
  pageSize: number
  total: number
  pages: number
  list: T[]
  emptyFlag: boolean
}

// SmartAdmin PageParam 格式
export interface PageParam {
  pageNum: number
  pageSize: number
  searchCount?: boolean
}

const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 后端服务地址（开发/生产环境均走代理，不需要直连）
export const API_BASE_URL = ''

// 将 URL 转为可访问的相对路径（走同域代理，避免直连 api.mayekun.com）
// 后端可能返回完整 URL 如 http://api.mayekun.com/admin/upload/xxx.jpg
// 需要转为相对路径 /admin/upload/xxx.jpg，走 Vite 代理（开发）或 Nginx 代理（生产）
export function resolveUrl(url: string | undefined | null): string {
  if (!url) return ''
  // 剥离 api.mayekun.com 域名前缀，转为相对路径
  if (url.startsWith('http://api.mayekun.com') || url.startsWith('https://api.mayekun.com')) {
    try {
      const u = new URL(url)
      return u.pathname
    } catch {
      return url
    }
  }
  // 其他完整 URL（非 api.mayekun.com）直接返回
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')) return url
  return url.startsWith('/') ? url : '/' + url
}

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 从 localStorage 获取 token（SmartAdmin 使用 satoken）
    const token = localStorage.getItem('sa-token')
    if (token) {
      config.headers['satoken'] = token
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 响应拦截器：解包 ResponseDTO
request.interceptors.response.use(
  (response: AxiosResponse<ResponseDTO>) => {
    const res = response.data
    if (res.code === 0 && res.ok) {
      return res.data
    }
    // 业务错误
    console.error(`[API Error] ${res.msg}`)
    return Promise.reject(new Error(res.msg || '请求失败'))
  },
  (error) => {
    console.error(`[Network Error] ${error.message}`)
    return Promise.reject(error)
  }
)

export default request
