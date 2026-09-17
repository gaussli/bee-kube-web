import { usePermission } from '@/composables/usePermission'

/**
 * 存储类页面权限缓存组合式函数
 */
export function useStorageClassPermission() {
  const { hasPermission } = usePermission()

  /** 页面级权限缓存 */
  const permissionMap: Record<string, boolean> = {
    create: hasPermission('kubernetes:storage:storageclass:create'),
    edit: hasPermission('kubernetes:storage:storageclass:edit'),
    view: hasPermission('kubernetes:storage:storageclass:view'),
    delete: hasPermission('kubernetes:storage:storageclass:delete'),
  }

  return { permissionMap }
}
