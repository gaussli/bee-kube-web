import { ref } from 'vue'

import { defineStore } from 'pinia'

export const useKubernetesStore = defineStore('kubernetes', () => {
  // 状态定义
  const activeClusterUid = ref<string>()

  function setActiveClusterUid(id: string) {
    activeClusterUid.value = id
  }

  return {
    activeClusterUid,
    setActiveClusterUid,
  }
})
