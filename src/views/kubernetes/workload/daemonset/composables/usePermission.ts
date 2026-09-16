import { usePermission } from '@/composables/usePermission'

/**
 * 守护进程集页面权限缓存组合式函数
 */
export function useDaemonSetPermission() {
  const { hasPermission } = usePermission()

  /** 页面级权限缓存 */
  const permissionMap: Record<string, boolean> = {
    create: hasPermission('kubernetes:workload:daemonset:create'),
    edit: hasPermission('kubernetes:workload:daemonset:edit'),
    view: hasPermission('kubernetes:workload:daemonset:view'),
    delete: hasPermission('kubernetes:workload:daemonset:delete'),
  }

  return { permissionMap }
}
