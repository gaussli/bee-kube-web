<template>
  <BeePage class="job-create-yaml">
    <BeeBackHeader title="创建Job YAML" @back="handleBack" />
    <BeeCard class="job-create-yaml__placeholder"> 创建Job YAML </BeeCard>
  </BeePage>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

import BeeBackHeader from '@/components/BeeBackHeader/index.vue'
import BeeCard from '@/components/BeeCard/index.vue'
import BeePage from '@/components/BeePage/index.vue'

defineOptions({ name: 'JobCreateYaml' })

const router = useRouter()

/** 返回上一页 */
function handleBack() {
  router.back()
}
</script>

<style lang="scss" scoped>
.job-create-yaml__placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  font-size: 16px;
  color: $color-text-secondary;
}
</style>
