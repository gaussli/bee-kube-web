import { usePermission } from '@/composables/usePermission'

/**
 * 有状态应用页面权限缓存组合式函数
 */
export function useStatefulSetPermission() {
  const { hasPermission } = usePermission()

  /** 页面级权限缓存 */
  const permissionMap: Record<string, boolean> = {
    create: hasPermission('kubernetes:workload:statefulset:create'),
    edit: hasPermission('kubernetes:workload:statefulset:edit'),
    view: hasPermission('kubernetes:workload:statefulset:view'),
    delete: hasPermission('kubernetes:workload:statefulset:delete'),
  }

  return { permissionMap }
}
