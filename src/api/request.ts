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
  baseURL: '',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

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
