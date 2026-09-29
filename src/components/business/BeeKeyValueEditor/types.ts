/**
 * 键值编辑器相关类型与工具
 * @module components/business/BeeKeyValueEditor/types
 */

/**
 * 键值条目
 * @remarks 编辑器内部以数组（而非 Record）承载数据，以支持「键暂未填写」「键重复」等编辑中间态
 */
export interface KeyValueItem {
  /** 键 */
  key: string
  /** 值 */
  value: string
}

/**
 * 判断条目是否未填写（键与值均为空）
 * @param item - 键值条目
 * @returns 是否未填写
 */
export function isBlankKeyValueItem(item: KeyValueItem): boolean {
  return !item.key && !item.value
}

/**
 * 将键值条目转换为 Record
 * @description 未填写的条目会被忽略；键重复时后者覆盖前者（重复校验由编辑器负责）
 * @param items - 键值条目数组
 * @returns 键值对 Record
 */
export function keyValueItemsToRecord(items: KeyValueItem[]): Record<string, string> {
  const record: Record<string, string> = {}
  items.forEach(item => {
    if (isBlankKeyValueItem(item)) return
    record[item.key] = item.value
  })
  return record
}

/**
 * 将 Record 转换为键值条目
 * @param record - 键值对 Record
 * @returns 键值条目数组
 */
export function recordToKeyValueItems(record?: Record<string, string>): KeyValueItem[] {
  if (!record) return []
  return Object.entries(record).map(([key, value]) => ({ key, value }))
}
