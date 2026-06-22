/**
 * BeeMenu 菜单组件类型定义
 * @module components/BeeMenu/types
 */

/** 菜单项通用属性 */
export interface MenuItemBase {
  /** 唯一标识 */
  index: string | number
  /** 菜单文本 */
  label: string
  /** 图标名称 */
  icon?: string
}

/** BeeMenu 上下文注入 key */
export const MenuContextKey = Symbol('beeMenuContext')
