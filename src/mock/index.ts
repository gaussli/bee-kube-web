import type { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

const mockRegistry = new Map<string, any>()
const mockDelay = 500

// 自动导入 mock 模块
const modules = import.meta.glob('./**/*.ts', { eager: true })

for (const path in modules) {
  const mod = modules[path] as any
  const requests = mod?.default || []
  for (const req of requests) {
    if (!req) continue
    const { method, url, handler } = req
    if (method && url && handler) {
      mockRegistry.set(`${method.toLowerCase()} ${url}`, handler)
    }
  }
}

export async function mockRequest(config: AxiosRequestConfig): Promise<AxiosResponse> {
  const { method, url, data, params } = config

  // 模拟延迟
  await new Promise(r => setTimeout(r, mockDelay))

  // 根据 url 和 method 分发 mock 响应
  const key = `${method?.toLowerCase()} ${url}`
  const mockData = mockRegistry.get(key)?.(data || params)

  if (mockData !== undefined) {
    return {
      data: { code: 20000, message: 'success', data: mockData },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: config as InternalAxiosRequestConfig,
      request: {}
    }
  }

  return Promise.reject(new Error(`Mock not found: ${method} ${url}`))
}
