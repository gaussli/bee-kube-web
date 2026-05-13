/** Dropdown 选项类型 */
export interface DropdownOption {
  /** 选项值 */
  value: string | number
  /** 选项标签（可选，不存在时显示 value） */
  label?: string
  /** 选项图标（可选） */
  icon?: string
}
