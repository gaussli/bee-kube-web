import { usePermission } from '@/composables/usePermission'

/**
 * 任务页面权限缓存组合式函数
 */
export function useJobPermission() {
  const { hasPermission } = usePermission()

  /** 页面级权限缓存 */
  const permissionMap: Record<string, boolean> = {
    create: hasPermission('kubernetes:workload:job:create'),
    edit: hasPermission('kubernetes:workload:job:edit'),
    view: hasPermission('kubernetes:workload:job:view'),
    delete: hasPermission('kubernetes:workload:job:delete'),
  }

  return { permissionMap }
}
