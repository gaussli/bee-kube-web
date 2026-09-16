import { usePermission } from '@/composables/usePermission'

/**
 * 节点页面权限缓存组合式函数
 */
export function useNodePermission() {
  const { hasPermission } = usePermission()

  /** 页面级权限缓存 */
  const permissionMap: Record<string, boolean> = {
    view: hasPermission('kubernetes:node:view'),
    edit: hasPermission('kubernetes:node:edit'),
  }

  return { permissionMap }
}
