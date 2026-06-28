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

// 后端服务地址（开发环境走 Vite 代理不需要，生产环境走 api.mayekun.com）
export const API_BASE_URL = import.meta.env.DEV
  ? ''
  : 'https://api.mayekun.com'

// 将相对路径的 URL 转为可访问的地址
// 开发环境：保持相对路径走 Vite 代理
// 生产环境：相对路径拼接 api.mayekun.com 域名
// 已经是完整 URL 的（http/https）直接返回
export function resolveUrl(url: string | undefined | null): string {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')) return url
  // 生产环境：拼接 api.mayekun.com 域名
  if (!import.meta.env.DEV && import.meta.env.VITE_UPLOAD_URL) {
    const base = import.meta.env.VITE_UPLOAD_URL as string
    const path = url.startsWith('/') ? url : '/' + url
    return base + path
  }
  // 开发环境：保持相对路径走 Vite 代理
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
