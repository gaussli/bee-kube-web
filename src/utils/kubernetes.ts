/**
 * Kubernetes 资源单位转换与容量格式化工具
 * @module utils/kubernetes
 */

import type { Quantity } from '@/types/kubernetes/types'

import {
  QUANTITY_UNIT_BINARY_VALUES,
  QUANTITY_UNIT_DECIMAL_VALUES,
  CAPACITY_BASE_BINARY,
  CAPACITY_BASE_DECIMAL,
  type QuantityUnit,
} from '@/config/kubernetes/core'

/**
 * 将 CPU 的 Quantity 对象转换为毫核（millicores）数值
 *
 * @remarks
 * Kubernetes 中 CPU 以毫核为单位，1000m = 1 核。转换规则：
 * - 单位 'm'（毫核）：直接取 value
 * - 单位 ''（核）：value × 1000
 * - 未提供或无效：返回 0
 *
 * @param q - CPU 资源的 Quantity 对象（单位 'm' 或 ''）
 * @returns 毫核数值
 *
 * @example
 * ```ts
 * toMillicoresOfQuantity({ value: 500, unit: 'm' })  // 500
 * toMillicoresOfQuantity({ value: 1, unit: '' })      // 1000
 * toMillicoresOfQuantity({ value: 1.5, unit: '' })    // 1500
 * toMillicoresOfQuantity(undefined)                   // 0
 * ```
 */
export function toMillicoresOfQuantity(q?: Quantity): number {
  if (!q) return 0
  return q.unit === 'm' ? q.value : q.value * 1000
}

/**
 * 将 Quantity 对象转换为字节数（memory / storage 专用）
 *
 * @remarks
 * 区分两种单位体系：
 * - 二进制体系（Ki/Mi/Gi/Ti/Pi/Ei）：以 CAPACITY_BASE_BINARY(1024) 为基数
 * - 十进制体系（K/M/G/T/P/E）：以 CAPACITY_BASE_DECIMAL(1000) 为基数
 * - 无单位（''）：按字节处理
 * 未提供或无效：返回 0。
 *
 * @param q - Quantity 对象，按其单位换算为字节数
 * @returns 字节数值
 *
 * @example
 * ```ts
 * toBytesOfQuantity({ value: 1, unit: 'Ki' })   // 1024
 * toBytesOfQuantity({ value: 1, unit: 'Mi' })   // 1048576
 * toBytesOfQuantity({ value: 1, unit: 'K' })    // 1000
 * toBytesOfQuantity({ value: 512, unit: '' })   // 512
 * toBytesOfQuantity(undefined)                  // 0
 * ```
 */
export function toBytesOfQuantity(q?: Quantity): number {
  if (!q) return 0
  if (q.unit === '') return q.value
  const binaryIndex = QUANTITY_UNIT_BINARY_VALUES.indexOf(q.unit)
  if (binaryIndex >= 0) return q.value * Math.pow(CAPACITY_BASE_BINARY, binaryIndex + 1)
  const decimalIndex = QUANTITY_UNIT_DECIMAL_VALUES.indexOf(q.unit)
  if (decimalIndex >= 0) return q.value * Math.pow(CAPACITY_BASE_DECIMAL, decimalIndex + 1)
  return q.value
}

/**
 * 将 Quantity 对象的 CPU 值格式化为用户友好的字符串
 *
 * @remarks
 * Kubernetes 中 CPU 资源以毫核（millicores）为单位，1000m = 1 核。
 * Quantity 单位约定：'m' 表示毫核，空单位 '' 表示核。
 * 转换规则：
 * - 值为 0 或未提供：显示为 "0"
 * - < 1000m：以毫核显示，如 "500m"
 * - >= 1000m：以核显示，如 "1"、"1.5"、"2"
 *
 * @param q - CPU 资源的 Quantity 对象（单位 'm' 或 ''）
 * @returns 用户友好的 CPU 资源字符串表示
 *
 * @example
 * ```ts
 * formatCpu({ value: 0, unit: '' })     // "0"
 * formatCpu({ value: 100, unit: 'm' })  // "100m"
 * formatCpu({ value: 500, unit: 'm' })  // "500m"
 * formatCpu({ value: 1000, unit: 'm' }) // "1"
 * formatCpu({ value: 1500, unit: 'm' }) // "1.5"
 * formatCpu({ value: 2, unit: '' })     // "2"
 * formatCpu({ value: 250, unit: 'm' })  // "250m"
 * formatCpu(undefined)                  // "-"
 * ```
 */
export function formatCpu(q?: Quantity): string {
  if (!q) return '-'

  // CPU 单位约定：'m' = 毫核，'' = 核（1 核 = 1000 毫核），与容量体系无关，固定使用 1000
  const millicores = q.unit === 'm' ? q.value : q.value * 1000
  if (millicores === 0) {
    return '0'
  }

  if (millicores < 1000) {
    return `${millicores}m`
  }

  const cores = millicores / 1000
  // 去除末尾多余的零（如 1.0 → 1，1.50 → 1.5）
  return parseFloat(cores.toFixed(3)).toString()
}

/**
 * 将用户友好的 CPU 字符串解析为 Quantity 对象
 *
 * @remarks
 * 与 {@link formatCpu} 互为逆操作。解析规则：
 * - 以 'm' 结尾：表示毫核，如 "500m" → { value: 500, unit: 'm' }
 * - 纯整数或小数（无单位）：表示核，如 "1" → { value: 1, unit: '' }、"1.5" → { value: 1.5, unit: '' }
 * - 空字符串或非法值（不匹配数字或带未知后缀）：返回 undefined
 *
 * @param s - 用户友好的 CPU 资源字符串
 * @returns CPU 资源的 Quantity 对象（单位 'm' 或 ''），非法输入返回 undefined
 *
 * @example
 * ```ts
 * parseCpu('0')      // { value: 0, unit: '' }
 * parseCpu('100m')   // { value: 100, unit: 'm' }
 * parseCpu('500m')   // { value: 500, unit: 'm' }
 * parseCpu('1')      // { value: 1, unit: '' }
 * parseCpu('1.5')    // { value: 1.5, unit: '' }
 * parseCpu('')       // undefined
 * ```
 */
export function parseCpu(s: string): Quantity | undefined {
  const trimmed = s.trim()
  const matched = trimmed.match(/^(\d+(?:\.\d+)?)(m)?$/)
  if (!matched) {
    return undefined
  }
  return { value: parseFloat(matched[1]), unit: (matched[2] ?? '') as QuantityUnit }
}

/**
 * 将 Quantity 对象的容量值格式化为用户友好的字符串
 *
 * @remarks
 * 与 {@link parseCapacity} 互为逆操作。内部先将 Quantity 按单位换算为字节，
 * 再由 {@link fromBytes} 以 1024 进制自动择取合适的二进制单位（Ki/Mi/Gi/...）展示。
 * 单位语义见 {@link QuantityUnit}：'Ki'/'Mi'/... 为二进制（1024 进制），'K'/'M'/... 为十进制（1000 进制）。
 *
 * @param q - 容量资源的 Quantity 对象（单位可为空、Ki/Mi/Gi/... 或 K/M/G/...）
 * @returns 用户友好的容量字符串，如 "48 Gi"、"512 Mi"、"1.2 G"
 *
 * @example
 * ```ts
 * formatCapacity({ value: 0, unit: '' })     // "0 B"
 * formatCapacity({ value: 512, unit: 'Mi' }) // "512 Mi"
 * formatCapacity({ value: 48, unit: 'Gi' })  // "48 Gi"
 * formatCapacity({ value: 1, unit: 'Ti' })   // "1 Ti"
 * formatCapacity(undefined)                  // "-"
 * ```
 */
export function formatCapacity(q?: Quantity): string {
  if (!q) return '-'

  const bytes = toBytesOfQuantity(q)
  if (bytes === 0) return '0'
  // 不足 1 KiB 时直接以 Byte 显示（二进制体系，基数为 CAPACITY_BASE_BINARY）
  if (bytes < CAPACITY_BASE_BINARY) return `${bytes} B`
  // 转为 KiB 后按二进制单位逐级向上择取最合适的单位
  let displayUnit = 0
  let displayValue = bytes / CAPACITY_BASE_BINARY
  while (displayValue >= CAPACITY_BASE_BINARY && displayUnit < QUANTITY_UNIT_BINARY_VALUES.length - 1) {
    displayValue /= CAPACITY_BASE_BINARY
    displayUnit++
  }
  const formatted = parseFloat(displayValue.toFixed(2)).toString()
  return `${formatted} ${QUANTITY_UNIT_BINARY_VALUES[displayUnit]}`
}

/**
 * 将用户友好的容量字符串解析为 Quantity 对象
 *
 * @remarks
 * 与 {@link formatCapacity} 互为逆操作。按字符串末尾的单位后缀识别 QuantityUnit，
 * 未带单位（纯数字）视为字节（unit = ''）。支持二进制（Ki/Mi/Gi/Ti/Pi/Ei）与
 * 十进制（K/M/G/T/P/E）单位，不在此集合内的后缀按字节处理。
 *
 * @param s - 用户友好的容量字符串，如 "48 Gi"、"512 Mi"、"1.2 G"
 * @returns 容量资源的 Quantity 对象
 *
 * @example
 * ```ts
 * parseCapacity('0 B')    // { value: 0, unit: '' }
 * parseCapacity('512 Mi') // { value: 512, unit: 'Mi' }
 * parseCapacity('48 Gi')  // { value: 48, unit: 'Gi' }
 * parseCapacity('1.2 G')  // { value: 1.2, unit: 'G' }
 * parseCapacity('1024')   // { value: 1024, unit: '' }
 * parseCapacity('')       // { value: 0, unit: '' }
 * ```
 */
export function parseCapacity(s: string): Quantity | undefined {
  const trimmed = s.trim()
  const matched = trimmed.match(/^(\d+(?:\.\d+)?)\s*([A-Za-z]*)$/)
  if (!matched) {
    return undefined
  }
  return { value: parseFloat(matched[1]), unit: matched[2] as QuantityUnit }
}

/**
 * 内存容量格式化（Quantity 对象 → 用户友好字符串）
 * @param q - 内存资源的 Quantity 对象
 * @returns 用户友好的内存容量字符串
 * @see formatCapacity
 */
export function formatMemory(q?: Quantity): string {
  return formatCapacity(q)
}

/**
 * 内存容量解析（用户友好字符串 → Quantity 对象）
 * @param s - 用户友好的内存容量字符串
 * @returns 内存资源的 Quantity 对象
 * @see parseCapacity
 */
export function parseMemory(s: string): Quantity | undefined {
  return parseCapacity(s)
}

/**
 * 存储容量格式化（Quantity 对象 → 用户友好字符串）
 * @param q - 存储资源的 Quantity 对象
 * @returns 用户友好的存储容量字符串
 * @see formatCapacity
 */
export function formatStorage(q?: Quantity): string {
  return formatCapacity(q)
}

/**
 * 存储容量解析（用户友好字符串 → Quantity 对象）
 * @param s - 用户友好的存储容量字符串
 * @returns 存储资源的 Quantity 对象
 * @see parseCapacity
 */
export function parseStorage(s: string): Quantity | undefined {
  return parseCapacity(s)
}

/**
 * 计算使用百分比
 *
 * @remarks
 * 根据已用量和总量计算百分比，总量小于等于 0 时返回 0。
 *
 * @param used - 已用量
 * @param total - 总量
 * @returns 百分比（0-100）
 *
 * @example
 * ```ts
 * calcPercentage(50, 100)   // 50
 * calcPercentage(0, 100)    // 0
 * calcPercentage(50, 0)     // 0
 * calcPercentage(33, 100)   // 33
 * ```
 */
export function calcPercentage(used: number, total: number): number {
  if (total <= 0) return 0
  return Math.round((used / total) * 100)
}
