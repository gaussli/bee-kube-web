/**
 * 状态单元格组件类型定义
 * @module components/BeeStatusCell/types
 */
export interface StatusConfig {
  /** 状态匹配值 */
  value: string | number | undefined
  /** 状态中文标签 */
  label: string
  /** 状态英文标签 */
  labelEn?: string
  /** 状态指示色 */
  color: string
}
