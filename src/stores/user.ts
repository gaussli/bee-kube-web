import { ref } from 'vue'

import { defineStore } from 'pinia'

import type { CurrentMenu, CurrentUser } from '@/types/auth/auth'

import { storage } from '@/utils'

/**
 * 用户状态管理
 * 管理用户登录信息、菜单权限、token等状态
 */
export const useUserStore = defineStore('user', () => {
  // 状态定义
  const token = ref<string>(storage.get('token', '') || '') // 用户认证token
  const currentUser = ref<CurrentUser | null>(null) // 当前登录用户信息
  const currentMenus = ref<CurrentMenu[] | null>(null) // 当前用户菜单树
  const currentPermissions = ref<string[] | null>(null) // 当前用户权限标识列表

  /**
   * 设置用户token
   * @param newToken - 新的认证token
   */
  function setToken(newToken: string) {
    token.value = newToken
    storage.set('token', newToken)
  }

  /**
   * 设置当前用户信息
   * @param user - 用户信息对象
   */
  function setCurrentUser(user: CurrentUser) {
    currentUser.value = user
    storage.set('current_user', user)
  }

  /**
   * 设置当前用户菜单树
   * @param menus - 菜单树结构数组
   */
  function setCurrentMenus(menus: CurrentMenu[]) {
    currentMenus.value = menus
    storage.set('current_menus', menus)
  }

  /**
   * 设置当前用户权限标识列表
   * @param permissions - 权限标识数组
   */
  function setCurrentPermissions(permissions: string[]) {
    currentPermissions.value = permissions
    storage.set('current_permissions', permissions)
  }

  /**
   * 获取用户token，优先从内存获取，失败时从本地存储获取
   * @returns 用户认证token
   */
  function getToken(): string {
    return token.value || storage.get('token', '') || ''
  }

  /**
   * 获取当前用户信息，优先从内存获取，失败时从本地存储获取
   * @returns 当前用户信息，未登录返回null
   */
  function getCurrentUser(): CurrentUser | null {
    return currentUser.value ?? storage.get<CurrentUser>('current_user') ?? null
  }

  /**
   * 获取当前用户菜单树，优先从内存获取，失败时从本地存储获取
   * @returns 菜单树数组，未登录返回null
   */
  function getCurrentMenus(): CurrentMenu[] {
    return currentMenus.value ?? storage.get<CurrentMenu[]>('current_menus') ?? []
  }

  /**
   * 获取当前用户权限标识列表，优先从内存获取，失败时从本地存储获取
   * @returns 权限标识数组，未登录返回null
   */
  function getCurrentPermissions(): string[] | null {
    return currentPermissions.value ?? storage.get<string[]>('current_permissions') ?? null
  }

  /**
   * 清除用户状态，包括内存和本地存储
   * 用于退出登录时清理所有用户相关数据
   */
  async function clear() {
    token.value = ''
    currentUser.value = null
    currentMenus.value = null
    currentPermissions.value = null
    storage.clear()
  }

  /**
   * 检查用户是否已登录
   * @returns true表示已登录，false表示未登录
   */
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
    isLogin,
  }
})
