<template>
  <BeePage class="statefulset-edit-yaml">
    <BeeBackHeader title="编辑StatefulSet YAML" @back="handleBack" />
    <BeeCard class="statefulset-edit-yaml__placeholder"> 编辑StatefulSet YAML </BeeCard>
  </BeePage>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

import BeeBackHeader from '@/components/BeeBackHeader/index.vue'
import BeeCard from '@/components/BeeCard/index.vue'
import BeePage from '@/components/BeePage/index.vue'

defineOptions({ name: 'StatefulSetEditYaml' })

const router = useRouter()

/** 返回上一页 */
function handleBack() {
  router.back()
}
</script>

<style lang="scss" scoped>
.statefulset-edit-yaml__placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  font-size: 16px;
  color: $color-text-secondary;
}
</style>
