/**
 * 应用全局状态管理
 * 管理应用级别的状态，如侧边栏、主题、加载状态、当前Tab等
 */

import { ref } from 'vue'
import { defineStore } from 'pinia'

/**
 * Tab类型
 * - kubernetes: 集群管理
 * - platform: 平台管理
 */
export type TabType = 'kubernetes' | 'platform'

/**
 * 应用状态管理store
 */
export const useAppStore = defineStore('app', () => {
  // 状态定义
  const sidebarOpened = ref(true) // 侧边栏展开状态，true展开，false收起
  const loading = ref(false) // 全局加载状态
  const theme = ref('light') // 主题配置，light=浅色主题，dark=深色主题
  const currentTab = ref<TabType>('kubernetes') // 当前Tab页，platform=平台管理，cluster=集群管理

  /**
   * 切换侧边栏展开/收起状态
   */
  function toggleSidebar() {
    sidebarOpened.value = !sidebarOpened.value
  }

  /**
   * 设置全局加载状态
   * @param isLoading - 加载状态，true显示loading，false隐藏loading
   */
  function setLoading(isLoading: boolean) {
    loading.value = isLoading
  }

  /**
   * 切换浅色/深色主题
   * 切换后会更新html根元素的data-theme属性
   */
  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', theme.value)
  }

  /**
   * 设置当前Tab页
   * @param tab - Tab类型，取值cluster或platform
   */
  function setCurrentTab(tab: TabType) {
    currentTab.value = tab
  }

  return {
    sidebarOpened,
    loading,
    theme,
    currentTab,
    toggleSidebar,
    setLoading,
    toggleTheme,
    setCurrentTab
  }
})
