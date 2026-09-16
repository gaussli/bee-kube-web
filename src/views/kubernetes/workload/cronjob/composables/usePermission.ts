import { usePermission } from '@/composables/usePermission'

/**
 * 定时任务页面权限缓存组合式函数
 */
export function useCronJobPermission() {
  const { hasPermission } = usePermission()

  /** 页面级权限缓存 */
  const permissionMap: Record<string, boolean> = {
    create: hasPermission('kubernetes:workload:cronjob:create'),
    edit: hasPermission('kubernetes:workload:cronjob:edit'),
    view: hasPermission('kubernetes:workload:cronjob:view'),
    delete: hasPermission('kubernetes:workload:cronjob:delete'),
  }

  return { permissionMap }
}
