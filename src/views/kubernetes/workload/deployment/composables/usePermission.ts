import { usePermission } from '@/composables/usePermission'

/**
 *
 */
export function useDeploymentPermission() {
  const { hasPermission } = usePermission()

  /** 页面级权限缓存 */
  const permissionMap: Record<string, boolean> = {
    create: hasPermission('kubernetes:workload:deployment:create'),
    edit: hasPermission('kubernetes:workload:deployment:edit'),
    view: hasPermission('kubernetes:workload:deployment:view'),
    delete: hasPermission('kubernetes:workload:deployment:delete'),
  }

  return { permissionMap }
}
