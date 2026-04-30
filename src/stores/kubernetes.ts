import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useKubernetesStore = defineStore('kubernetes', () => {
  // 状态定义
  const activeClusterId = ref<string>()

  function setActiveClusterId(id: string) {
    activeClusterId.value = id
  }

  return {
    activeClusterId,
    setActiveClusterId
  }
})
