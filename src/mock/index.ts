import type { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

/** Mock handler 上下文对象 */
export interface MockContext {
  /** 路径参数（如 :id、:clusterId） */
  pathParams: Record<string, string>
  /** URL 查询参数 */
  params: any
  /** 请求体数据 */
  data: any
}

interface MockHandler {
  method: string
  url: string
  handler: (ctx: MockContext) => any
}

const mockHandlers: MockHandler[] = []
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
      mockHandlers.push({ method: method.toLowerCase(), url, handler })
    }
  }
}

/**
 * 对 mock handler 按路由精确度排序，确保静态路由优先于参数化路由匹配
 * @remarks
 * 排序规则：
 * 1. 静态路由（无 :param）优先于参数化路由（有 :param）
 * 2. 同级之间按路径段数降序（更具体的路径优先）
 * 3. 确保 /batch 不会被 /:uid 抢先捕获
 */
mockHandlers.sort((a, b) => {
  const aParamCount = (a.url.match(/:[^/]+/g) || []).length
  const bParamCount = (b.url.match(/:[^/]+/g) || []).length
  // 参数段少的优先（0个参数 = 静态路由，排最前）
  if (aParamCount !== bParamCount) return aParamCount - bParamCount
  // 参数段数量相同时，路径段数多的优先（更精确）
  const aSegments = a.url.split('/').length
  const bSegments = b.url.split('/').length
  return bSegments - aSegments
})

/**
 * 将 URL 路径转换为正则表达式，支持 :param 格式
 * @param url
 */
function pathToRegex(url: string): { regex: RegExp; paramNames: string[] } {
  const paramNames: string[] = []
  const regexStr = url.replace(/:([^/]+)/g, (_, paramName) => {
    paramNames.push(paramName)
    return '([^/]+)'
  })
  return { regex: new RegExp(`^${regexStr}$`), paramNames }
}

/**
 * 提取 URL 中的路径参数
 * @param url
 * @param regex
 * @param paramNames
 */
function extractParams(url: string, regex: RegExp, paramNames: string[]): Record<string, string> {
  const match = url.match(regex)
  if (!match) return {}
  const params: Record<string, string> = {}
  paramNames.forEach((name, index) => {
    params[name] = match[index + 1]
  })
  return params
}

/**
 *
 * @param config
 */
export async function mockRequest(config: AxiosRequestConfig): Promise<AxiosResponse> {
  const { method, url, data, params } = config

  // 模拟延迟
  await new Promise(r => setTimeout(r, mockDelay))

  // 根据 url 和 method 分发 mock 响应
  const methodLower = method?.toLowerCase()

  for (const mock of mockHandlers) {
    const { regex, paramNames } = pathToRegex(mock.url)
    if (mock.method === methodLower && regex.test(url as string)) {
      const pathParams = extractParams(url as string, regex, paramNames)
      const mockData = mock.handler({ pathParams, params, data })
      return {
        data: { code: 20000, message: 'success', data: mockData },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: config as InternalAxiosRequestConfig,
        request: {},
      }
    }
  }

  return Promise.reject(new Error(`Mock not found: ${method} ${url}`))
}
