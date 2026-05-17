/**
 * Mock 工具函数
 */

/**
 * 生成32位随机ID（数字+小写字母）
 * @returns 随机生成的32位ID字符串
 */
export function generateId(): string {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyz'
  let id = ''
  for (let i = 0; i < 32; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return id
}

/**
 * 生成随机索引
 * @param len - 数组长度
 * @returns 0 到 len-1 之间的随机整数
 */
export function randomIndex(len: number): number {
  return Math.floor(Math.random() * len)
}

/**
 * 生成镜像拉取密钥名称
 * @returns 镜像拉取密钥名称，格式：regcred-{8位随机字符}
 */
export function generateImagePullSecretName(): string {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyz'
  let suffix = ''
  for (let i = 0; i < 8; i++) {
    suffix += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return `regcred-${suffix}`
}
