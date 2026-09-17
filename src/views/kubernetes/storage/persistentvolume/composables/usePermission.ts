import { usePermission } from '@/composables/usePermission'

/**
 * 持久卷页面权限缓存组合式函数
 */
export function usePersistentVolumePermission() {
  const { hasPermission } = usePermission()

  /** 页面级权限缓存 */
  const permissionMap: Record<string, boolean> = {
    create: hasPermission('kubernetes:storage:persistentvolume:create'),
    edit: hasPermission('kubernetes:storage:persistentvolume:edit'),
    view: hasPermission('kubernetes:storage:persistentvolume:view'),
    delete: hasPermission('kubernetes:storage:persistentvolume:delete'),
  }

  return { permissionMap }
}
