<template>
  <BeePage class="daemonset-edit-yaml">
    <BeeBackHeader title="编辑DaemonSet YAML" @back="handleBack" />
    <BeeCard class="daemonset-edit-yaml__placeholder"> 编辑DaemonSet YAML </BeeCard>
  </BeePage>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

import BeeBackHeader from '@/components/BeeBackHeader/index.vue'
import BeeCard from '@/components/BeeCard/index.vue'
import BeePage from '@/components/BeePage/index.vue'

defineOptions({ name: 'DaemonSetEditYaml' })

const router = useRouter()

/** 返回上一页 */
function handleBack() {
  router.back()
}
</script>

<style lang="scss" scoped>
.daemonset-edit-yaml__placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  font-size: 16px;
  color: $color-text-secondary;
}
</style>
