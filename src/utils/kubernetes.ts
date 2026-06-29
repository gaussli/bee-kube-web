/**
 * Kubernetes 资源单位转换与容量格式化工具
 * @module utils/kubernetes
 */

/** 内存/磁盘容量单位（二进制单位，1024 进制） */
const CAPACITY_UNITS = ['Ki', 'Mi', 'Gi', 'Ti', 'Pi', 'Ei'] as const
/** 容量单位，支持原始字节 B 及二进制单位 Ki/Mi/Gi/Ti/Pi/Ei */
type CapacityUnit = 'B' | (typeof CAPACITY_UNITS)[number]

/** 容量单位基数 */
const CAPACITY_BASE = 1024

// ==================== 通用计算 ====================

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

// ==================== CPU 转换 ====================

/**
 * 将微核(millicores)单位的 CPU 值转换为用户友好格式
 *
 * @remarks
 * Kubernetes 中 CPU 资源以微核（millicores）为单位，1000m = 1 核。
 * 转换规则：
 * - < 1000m：以微核显示，如 "500m"
 * - = 0：显示为 "0"
 * - >= 1000m：以核显示，如 "1"、"1.5"、"2"
 *
 * @param millicores - CPU 资源值，单位为微核
 * @returns 用户友好的 CPU 资源字符串表示
 *
 * @example
 * ```ts
 * formatCpu(0)     // "0"
 * formatCpu(100)   // "100m"
 * formatCpu(500)   // "500m"
 * formatCpu(1000)  // "1"
 * formatCpu(1500)  // "1.5"
 * formatCpu(2000)  // "2"
 * formatCpu(250)   // "250m"
 * ```
 */
export function formatCpu(millicores: number): string {
  if (millicores === 0) {
    return '0'
  }

  if (millicores < 1000) {
    return `${millicores}m`
  }

  const cores = millicores / 1000
  // 去除末尾多余的零（如 1.0 → 1，1.50 → 1.5）
  const formatted = parseFloat(cores.toFixed(3)).toString()
  return formatted
}

/**
 * 将用户友好的 CPU 字符串解析为微核(millicores)单位的数值
 *
 * @remarks
 * 与 {@link formatCpu} 互为逆操作。解析规则：
 * - 以 "m" 结尾：直接解析为微核值，如 "500m" → 500
 * - 不以 "m" 结尾：按核解析，乘以 1000 转为微核，如 "1" → 1000、"1.5" → 1500
 *
 * @param cpuStr - 用户友好的 CPU 字符串，如 "1"、"1.5"、"500m"
 * @returns 微核单位的 CPU 数值
 *
 * @example
 * ```ts
 * parseCpu("0")     // 0
 * parseCpu("100m")  // 100
 * parseCpu("500m")  // 500
 * parseCpu("1")     // 1000
 * parseCpu("1.5")   // 1500
 * parseCpu("2")     // 2000
 * ```
 */
export function parseCpu(cpuStr: string): number {
  const trimmed = cpuStr.trim()

  if (trimmed === '' || trimmed === '0') {
    return 0
  }

  // 微核格式，如 "500m"
  if (trimmed.endsWith('m')) {
    const numPart = trimmed.slice(0, -1)
    return parseFloat(numPart) || 0
  }

  // 核格式，如 "1"、"1.5"
  return Math.round(parseFloat(trimmed) * 1000) || 0
}

// ==================== 内存容量转换 ====================

/**
 * 将内存容量数值格式化为用户友好的字符串
 *
 * @remarks
 * 使用二进制单位（1024 进制），与 Kubernetes 资源单位的计量方式一致。
 * 自动选择最合适的单位进行展示，如 512 Mi、48 Gi、1 Ti。
 *
 * @param value - 内存容量数值
 * @param inputUnit - 输入值的单位，默认为 'Gi'（与 Kubernetes 中 memory 字段对齐）
 * @returns 格式化后的内存容量字符串，如 "512 Mi"、"48 Gi"、"1 Ti"
 *
 * @example
 * ```ts
 * formatMemory(0)        // "0"
 * formatMemory(512, 'Mi') // "512 Mi"
 * formatMemory(48)       // "48 Gi"
 * formatMemory(1024)     // "1 Ti"
 * formatMemory(0.5)      // "512 Mi"
 * ```
 */
export function formatMemory(value: number, inputUnit: CapacityUnit = 'Gi'): string {
  return formatCapacity(value, inputUnit)
}

/**
 * 将用户友好的内存容量字符串解析为指定单位的数值
 *
 * @remarks
 * 支持格式如 "48 Gi"、"512 Mi"、"1 Ti"。若字符串未包含单位，
 * 则按默认输入单位解析。提取数值部分后按二进制进制转换。
 *
 * @param memStr - 内存容量字符串，如 "48 Gi"、"512 Mi"
 * @param targetUnit - 目标输出单位，默认为 'Gi'
 * @returns 指定单位的数值
 *
 * @example
 * ```ts
 * parseMemory("48 Gi")        // 48
 * parseMemory("512 Mi")       // 0.5
 * parseMemory("1 Ti")         // 1024
 * parseMemory("48 Gi", 'Mi')  // 49152
 * ```
 */
export function parseMemory(memStr: string, targetUnit: CapacityUnit = 'Gi'): number {
  return parseCapacity(memStr, targetUnit)
}

// ==================== 磁盘容量转换 ====================

/**
 * 将磁盘容量数值格式化为用户友好的字符串
 *
 * @remarks
 * 使用二进制单位（1024 进制），与 Kubernetes 资源单位的计量方式一致。
 * 自动选择最合适的单位进行展示。
 *
 * @param value - 磁盘容量数值
 * @param inputUnit - 输入值的单位，默认为 'Gi'（与 Kubernetes 中 storage 字段对齐）
 * @returns 格式化后的磁盘容量字符串，如 "320 Gi"、"1 Ti"
 *
 * @example
 * ```ts
 * formatDisk(0)          // "0"
 * formatDisk(320)        // "320 Gi"
 * formatDisk(1024)       // "1 Ti"
 * formatDisk(0.5)        // "512 Mi"
 * formatDisk(2048)       // "2 Ti"
 * ```
 */
export function formatDisk(value: number, inputUnit: CapacityUnit = 'Gi'): string {
  return formatCapacity(value, inputUnit)
}

/**
 * 将用户友好的磁盘容量字符串解析为指定单位的数值
 *
 * @remarks
 * 支持格式如 "320 Gi"、"1 Ti"、"500 Mi"。若字符串未包含单位，
 * 则按默认输入单位解析。
 *
 * @param diskStr - 磁盘容量字符串，如 "320 Gi"、"1 Ti"
 * @param targetUnit - 目标输出单位，默认为 'Gi'
 * @returns 指定单位的数值
 *
 * @example
 * ```ts
 * parseDisk("320 Gi")         // 320
 * parseDisk("1 Ti")           // 1024
 * parseDisk("512 Mi")         // 0.5
 * parseDisk("1 Ti", 'Mi')     // 1048576
 * ```
 */
export function parseDisk(diskStr: string, targetUnit: CapacityUnit = 'Gi'): number {
  return parseCapacity(diskStr, targetUnit)
}

// ==================== 内部通用容量处理 ====================

/**
 * 获取单位在 CAPACITY_UNITS 中的索引
 * @param unit - 容量单位
 * @returns 单位索引
 */
function getUnitIndex(unit: Exclude<CapacityUnit, 'B'>): number {
  return CAPACITY_UNITS.indexOf(unit)
}

/**
 * 将容量数值从指定单位转换为字节数
 * @param value - 数值
 * @param unit - 输入单位，'B' 表示原始字节，直接返回
 * @returns 字节数
 */
function toBytes(value: number, unit: CapacityUnit): number {
  if (unit === 'B') return value
  return value * Math.pow(CAPACITY_BASE, getUnitIndex(unit) + 1)
}

/**
 * 将字节数格式化为最合适的容量单位字符串
 * @param bytes - 字节数
 * @returns 格式化后的容量字符串，如 "48 Gi"、"512 Mi"
 */
function fromBytes(bytes: number): string {
  if (bytes === 0) return '0'

  // 不足 1 KiB 时直接以 Byte 显示
  if (bytes < CAPACITY_BASE) return `${bytes} B`

  // 先转为 KiB，使 displayUnit 索引与 CAPACITY_UNITS 对齐
  let displayUnit = 0
  let displayValue = bytes / CAPACITY_BASE
  while (displayValue >= CAPACITY_BASE && displayUnit < CAPACITY_UNITS.length - 1) {
    displayValue /= CAPACITY_BASE
    displayUnit++
  }

  const formatted = parseFloat(displayValue.toFixed(2)).toString()
  return `${formatted} ${CAPACITY_UNITS[displayUnit]}`
}

/**
 * 通用容量格式化方法
 *
 * @remarks
 * 将指定单位的容量数值转换为最合适的显示格式。
 * 自动选择不超过 3 位整数的最大单位进行展示。
 *
 * @param value - 容量数值
 * @param inputUnit - 输入值单位
 * @returns 格式化后的容量字符串
 *
 * @example
 * ```ts
 * formatCapacity(0, 'Gi')      // "0"
 * formatCapacity(48, 'Gi')     // "48 Gi"
 * formatCapacity(1024, 'Gi')   // "1 Ti"
 * formatCapacity(0.5, 'Gi')    // "512 Mi"
 * ```
 */
function formatCapacity(value: number, inputUnit: CapacityUnit): string {
  if (value === 0) return '0'
  const bytes = toBytes(value, inputUnit)
  return fromBytes(bytes)
}

/**
 * 通用容量解析方法
 *
 * @remarks
 * 将容量字符串解析为指定单位的数值。
 * 支持的输入格式：
 * - 带单位字符串："48 Gi"、"512 Mi"、"1 Ti"
 * - 纯数字字符串（按 targetUnit 解析）
 *
 * @param str - 容量字符串
 * @param targetUnit - 目标输出单位
 * @returns 目标单位的数值
 *
 * @example
 * ```ts
 * parseCapacity("48 Gi", 'Gi')   // 48
 * parseCapacity("512 Mi", 'Gi')  // 0.5
 * parseCapacity("1 Ti", 'Gi')    // 1024
 * ```
 */
function parseCapacity(str: string, targetUnit: CapacityUnit): number {
  const trimmed = str.trim()

  if (trimmed === '' || trimmed === '0') return 0

  // 匹配 "数值 + 可选空格 + 单位" 格式，如 "48Gi"、"48 Gi"、"512 Mi"
  const match = trimmed.match(/^([\d.]+)\s*(B|Ki|Mi|Gi|Ti|Pi|Ei)$/i)
  if (match) {
    const numPart = parseFloat(match[1])
    const unit = match[2] as CapacityUnit
    const bytes = toBytes(numPart, unit)
    if (targetUnit === 'B') return bytes
    return bytes / Math.pow(CAPACITY_BASE, getUnitIndex(targetUnit) + 1)
  }

  // 纯数字，按目标单位直接解析
  return parseFloat(trimmed) || 0
}
