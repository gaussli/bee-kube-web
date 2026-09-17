import { usePermission } from '@/composables/usePermission'

/**
 * 网络策略页面权限缓存组合式函数
 */
export function useNetworkPolicyPermission() {
  const { hasPermission } = usePermission()

  /** 页面级权限缓存 */
  const permissionMap: Record<string, boolean> = {
    create: hasPermission('kubernetes:network:networkpolicy:create'),
    edit: hasPermission('kubernetes:network:networkpolicy:edit'),
    view: hasPermission('kubernetes:network:networkpolicy:view'),
    delete: hasPermission('kubernetes:network:networkpolicy:delete'),
  }

  return { permissionMap }
}
