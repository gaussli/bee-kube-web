// 业务异常类
/**
 *
 */
export class BizError extends Error {
  code: number

  /**
   *
   * @param code
   * @param message
   */
  constructor(code: number, message: string) {
    super(message)
    this.name = 'BizError'
    this.code = code
  }
}

// 常用业务异常工厂函数
export const createError = {
  unauthorized: () => new BizError(401, '未授权'),
  forbidden: () => new BizError(403, '无权限'),
  notFound: () => new BizError(404, '资源不存在'),
}
