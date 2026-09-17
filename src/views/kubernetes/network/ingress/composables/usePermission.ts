import { usePermission } from '@/composables/usePermission'

/**
 * 入口页面权限缓存组合式函数
 */
export function useIngressPermission() {
  const { hasPermission } = usePermission()

  /** 页面级权限缓存 */
  const permissionMap: Record<string, boolean> = {
    create: hasPermission('kubernetes:network:ingress:create'),
    edit: hasPermission('kubernetes:network:ingress:edit'),
    view: hasPermission('kubernetes:network:ingress:view'),
    delete: hasPermission('kubernetes:network:ingress:delete'),
  }

  return { permissionMap }
}
