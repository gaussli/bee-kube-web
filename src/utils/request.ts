import axios from 'axios'

import { ElMessage } from 'element-plus'

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

import { mockRequest } from '@/mock'

import router from '@/router'
import { useUserStore } from '@/stores'

import { BizError } from './error'
import { storage } from './storage'

const useMock = import.meta.env.VITE_USE_MOCK === 'true'

// 创建 axios 实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
    'Accept': 'application/json',
  },
})

// 开发环境使用 mock adapter
if (useMock) {
  service.defaults.adapter = async (config: InternalAxiosRequestConfig) => {
    try {
      console.log('running mock request...', config.url)
      const response = await mockRequest(config)
      return response
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (!useMock) {
      const token = useUserStore().getToken()
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  error => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  },
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    response.headers && handleRefreshToken(response.headers)
    const { code, message, data } = response.data
    if (code === 20000) {
      return data
    } else if (code === 10002 || code === 10003) {
      ElMessage.error('登录已过期，请重新登录')
      storage.clear()
      router.push('/login')
    } else {
      ElMessage.error(`[${code}]: ${message || '请求失败'}`)
    }
    return Promise.reject(new BizError(code, message || '请求失败'))
  },
  error => {
    if (error.response) {
      console.log('服务器响应错误:', error.response)
      const { status, headers, data } = error.response
      headers && handleRefreshToken(headers)
      ElMessage.error(`[${status}${data?.code ? `|${data.code}` : ''}]: ${data?.message || '网络异常'}`)
    } else if (error.request) {
      console.log('请求已发出但没有响应:', error.request)
      ElMessage.error('网络异常')
    } else {
      console.log('其他错误:', error.message)
      ElMessage.error('网络异常')
    }
    return Promise.reject(error)
  },
)

function handleRefreshToken(headers: any) {
  const refreshToken = headers['x-custom-header']
  if (refreshToken) {
    useUserStore().setToken(refreshToken)
  }
}

// 封装请求方法
export const request = {
  get<T = any>(url: string, params?: object, data?: object, config?: AxiosRequestConfig): Promise<T> {
    return service.get(url, { params, data, ...config })
  },

  post<T = any>(url: string, data?: object, config?: AxiosRequestConfig): Promise<T> {
    return service.post(url, data, config)
  },

  put<T = any>(url: string, data?: object, config?: AxiosRequestConfig): Promise<T> {
    return service.put(url, data, config)
  },

  delete<T = any>(url: string, params?: object, data?: object, config?: AxiosRequestConfig): Promise<T> {
    return service.delete(url, { params, data, ...config })
  },

  patch<T = any>(url: string, data?: object, config?: AxiosRequestConfig): Promise<T> {
    return service.patch(url, data, config)
  },
}

export default service
