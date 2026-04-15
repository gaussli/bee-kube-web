import { ref } from 'vue'
import { defineStore } from 'pinia'
import { storage } from '@/utils'
import type { CurrentMenu, CurrentUser } from '@/types'

export const useUserStore = defineStore('user', () => {
  // 状态
  const token = ref<string>(storage.get('token', '') || '')
  const currentUser = ref<CurrentUser | null>(null)
  const currentMenus = ref<CurrentMenu[] | null>(null)
  const currentPermissions = ref<string[] | null>(null)

  function setToken(newToken: string) {
    token.value = newToken
    storage.set('token', newToken)
  }

  function setCurrentUser(user: CurrentUser) {
    currentUser.value = user
    storage.set('current_user', user)
  }

  function setCurrentMenus(menus: CurrentMenu[]) {
    currentMenus.value = menus
    storage.set('current_menus', menus)
  }

  function setCurrentPermissions(permissions: string[]) {
    currentPermissions.value = permissions
    storage.set('current_permissions', permissions)
  }

  function getToken(): string {
    return token.value || storage.get('token', '') || ''
  }

  function getCurrentUser(): CurrentUser | null {
    return currentUser.value ?? storage.get<CurrentUser>('current_user') ?? null
  }

  function getCurrentMenus(): CurrentMenu[] | null {
    return currentMenus.value ?? storage.get<CurrentMenu[]>('current_menus') ?? null
  }

  function getCurrentPermissions(): string[] | null {
    return currentPermissions.value ?? storage.get<string[]>('current_permissions') ?? null
  }

  async function clear() {
    token.value = ''
    currentUser.value = null
    currentMenus.value = null
    currentPermissions.value = null
    storage.remove(['token', 'current_user', 'current_menus', 'current_permissions'])
  }

  // 检查是否已登录
  const isLogin = () => !!getToken()

  return {
    setToken,
    setCurrentUser,
    setCurrentMenus,
    setCurrentPermissions,
    getToken,
    getCurrentUser,
    getCurrentMenus,
    getCurrentPermissions,
    clear,
    isLogin
  }
})
