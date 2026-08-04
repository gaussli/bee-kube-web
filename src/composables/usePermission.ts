import { useUserStore } from '@/stores/user'

/**
 * 权限校验组合式函数
 */
export function usePermission() {
  const userStore = useUserStore()

  /**
   * 检查是否具有指定权限
   * @param permission 权限标识，可以是单个字符串或字符串数组
   * @param mode 'every' | 'some' - every: 全部拥有才返回 true; some: 任一拥有就返回 true
   */
  function hasPermission(permission: string | string[], mode: 'every' | 'some' = 'some'): boolean {
    const permissions = userStore.getCurrentPermissions()
    if (!permissions || permissions.length === 0) {
      return false
    }

    const permissionList = Array.isArray(permission) ? permission : [permission]
    if (permissionList.length === 0) {
      return true
    }

    if (mode === 'every') {
      return permissionList.every(p => permissions.includes(p))
    }
    return permissionList.some(p => permissions.includes(p))
  }

  /**
   * 检查是否具有所有指定权限
   */
  function hasEveryPermission(permission: string | string[]): boolean {
    return hasPermission(permission, 'every')
  }

  /**
   * 检查是否具有任一指定权限
   */
  function hasSomePermission(permission: string | string[]): boolean {
    return hasPermission(permission, 'some')
  }

  /**
   * 检查是否已登录
   */
  function isLogin(): boolean {
    return userStore.isLogin()
  }

  return {
    hasPermission,
    hasEveryPermission,
    hasSomePermission,
    isLogin,
  }
}

/**
 * v-permission 指令
 * 用法: v-permission="'system:user:create'" 或 v-permission="['system:user:create', 'system:user:edit']"
 */
export const vPermission = {
  mounted(el: HTMLElement, binding: { value: string | string[]; oldValue?: string | string[] }) {
    const { hasPermission } = usePermission()
    const updateVisibility = () => {
      if (!binding.value || binding.value.length === 0) {
        return
      }
      const visible = hasPermission(binding.value)
      el.style.display = visible ? '' : 'none'
    }
    updateVisibility()
  },
  updated(el: HTMLElement, binding: { value: string | string[]; oldValue?: string | string[] }) {
    if (binding.value !== binding.oldValue) {
      const { hasPermission } = usePermission()
      const updateVisibility = () => {
        if (!binding.value || binding.value.length === 0) {
          return
        }
        const visible = hasPermission(binding.value)
        el.style.display = visible ? '' : 'none'
      }
      updateVisibility()
    }
  },
}
