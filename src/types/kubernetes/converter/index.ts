/**
 * Kubernetes 资源单位转换工具
 * @module types/kubernetes/converter
 */

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
