/**
 * 存储管理
 */
const STORAGE_PREFIX = import.meta.env.VITE_STORAGE_PREFIX || "bee_";

export const storage = {
  // 设置
  set<T = any>(key: string, value: T, expire?: number): void {
    const data = {
      value,
      expire: expire ? Date.now() + expire * 1000 : null,
    };
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
  },

  // 获取
  get<T = any>(key: string, defaultValue?: T): T | null {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    if (!item) return defaultValue ?? null;

    try {
      const data = JSON.parse(item);
      // 检查是否过期
      if (data.expire && Date.now() > data.expire) {
        this.remove(key);
        return defaultValue ?? null;
      }
      return data.value;
    } catch {
      return defaultValue ?? null;
    }
  },

  // 删除
  remove(keys: string[]): void {
    keys.forEach((key) => {
      localStorage.removeItem(STORAGE_PREFIX + key);
    });
  },

  // 清空
  clear(): void {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  },

  // 获取所有键
  keys(): string[] {
    const keys = Object.keys(localStorage);
    return keys
      .filter((key) => key.startsWith(STORAGE_PREFIX))
      .map((key) => key.replace(STORAGE_PREFIX, ""));
  },
};

/**
 * 格式化日期
 */
export function formatDate(
  date: Date | string | number,
  format: string = "YYYY-MM-DD HH:mm:ss",
): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hour = String(d.getHours()).padStart(2, "0");
  const minute = String(d.getMinutes()).padStart(2, "0");
  const second = String(d.getSeconds()).padStart(2, "0");

  return format
    .replace("YYYY", String(year))
    .replace("MM", month)
    .replace("DD", day)
    .replace("HH", hour)
    .replace("mm", minute)
    .replace("ss", second);
}

/**
 * 防抖
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 300,
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * 节流
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 300,
): (...args: Parameters<T>) => void {
  let last = 0;
  return function (this: any, ...args: Parameters<T>) {
    const now = Date.now();
    if (now - last > delay) {
      last = now;
      fn.apply(this, args);
    }
  };
}

/**
 * 深拷贝
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== "object") return obj;

  if (obj instanceof Date) return new Date(obj.getTime()) as any;
  if (obj instanceof Array) return obj.map((item) => deepClone(item)) as any;
  if (obj instanceof Object) {
    const clonedObj: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone((obj as any)[key]);
      }
    }
    return clonedObj;
  }

  return obj;
}

/**
 * 生成随机 ID
 */
export function generateId(length: number = 8): string {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length);
}
