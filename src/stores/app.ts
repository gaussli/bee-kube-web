import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', () => {
  // 侧边栏展开状态
  const sidebarOpened = ref(true)
  // 加载状态
  const loading = ref(false)
  // 主题
  const theme = ref('light')

  // 切换侧边栏
  function toggleSidebar() {
    sidebarOpened.value = !sidebarOpened.value
  }

  // 设置加载状态
  function setLoading(isLoading: boolean) {
    loading.value = isLoading
  }

  // 切换主题
  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', theme.value)
  }

  return {
    sidebarOpened,
    loading,
    theme,
    toggleSidebar,
    setLoading,
    toggleTheme
  }
})
