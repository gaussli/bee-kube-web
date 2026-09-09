/** Dropdown 选项类型 */
export interface DropdownOption {
  /** 选项值 */
  value: string | number
  /** 选项标签 */
  label: string
  /** 选项图标 */
  icon?: string
  /** 分隔线标记 */
  divided?: boolean
}
