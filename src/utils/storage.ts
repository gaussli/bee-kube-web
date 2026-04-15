/**
 * 存储管理
 */
const STORAGE_PREFIX = import.meta.env.VITE_STORAGE_PREFIX || 'bee_'

export const storage = {
  // 设置
  set<T = any>(key: string, value: T, expire?: number): void {
    const data = {
      value,
      expire: expire ? Date.now() + expire * 1000 : null
    }
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data))
  },

  // 获取
  get<T = any>(key: string, defaultValue?: T): T | null {
    const item = localStorage.getItem(STORAGE_PREFIX + key)
    if (!item) return defaultValue ?? null

    try {
      const data = JSON.parse(item)
      // 检查是否过期
      if (data.expire && Date.now() > data.expire) {
        this.remove(key)
        return defaultValue ?? null
      }
      return data.value
    } catch {
      return defaultValue ?? null
    }
  },

  // 删除
  remove(keys: string[]): void {
    keys.forEach(key => {
      localStorage.removeItem(STORAGE_PREFIX + key)
    })
  },

  // 清空
  clear(): void {
    const keys = Object.keys(localStorage)
    keys.forEach(key => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key)
      }
    })
  },

  // 获取所有键
  keys(): string[] {
    const keys = Object.keys(localStorage)
    return keys.filter(key => key.startsWith(STORAGE_PREFIX)).map(key => key.replace(STORAGE_PREFIX, ''))
  }
}
