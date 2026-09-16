import { usePermission } from '@/composables/usePermission'

/**
 * 配置映射页面权限缓存组合式函数
 */
export function useConfigMapPermission() {
  const { hasPermission } = usePermission()

  /** 页面级权限缓存 */
  const permissionMap: Record<string, boolean> = {
    create: hasPermission('kubernetes:config:configmap:create'),
    edit: hasPermission('kubernetes:config:configmap:edit'),
    view: hasPermission('kubernetes:config:configmap:view'),
    delete: hasPermission('kubernetes:config:configmap:delete'),
  }

  return { permissionMap }
}
