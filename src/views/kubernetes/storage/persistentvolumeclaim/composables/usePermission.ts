import { usePermission } from '@/composables/usePermission'

/**
 * 持久卷声明页面权限缓存组合式函数
 */
export function usePersistentVolumeClaimPermission() {
  const { hasPermission } = usePermission()

  /** 页面级权限缓存 */
  const permissionMap: Record<string, boolean> = {
    create: hasPermission('kubernetes:storage:persistentvolumeclaim:create'),
    edit: hasPermission('kubernetes:storage:persistentvolumeclaim:edit'),
    view: hasPermission('kubernetes:storage:persistentvolumeclaim:view'),
    delete: hasPermission('kubernetes:storage:persistentvolumeclaim:delete'),
  }

  return { permissionMap }
}
