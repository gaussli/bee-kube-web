import type { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

interface MockHandler {
  method: string
  url: string
  handler: (pathParams: Record<string, string>, params: any, data: any) => any
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

  console.log('mock:::', params)

  // 模拟延迟
  await new Promise(r => setTimeout(r, mockDelay))

  // 根据 url 和 method 分发 mock 响应
  const methodLower = method?.toLowerCase()

  for (const mock of mockHandlers) {
    const { regex, paramNames } = pathToRegex(mock.url)
    if (mock.method === methodLower && regex.test(url as string)) {
      const pathParams = extractParams(url as string, regex, paramNames)
      const mockData = mock.handler(pathParams, params, data)
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
