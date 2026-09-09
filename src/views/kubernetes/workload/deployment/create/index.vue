<template>
  <BeePage class="deployment-create">
    <BeeBackHeader title="创建Deployment" @back="handleBack" />
    <BeeCard class="deployment-create__placeholder"> 创建Deployment </BeeCard>
  </BeePage>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

import BeeBackHeader from '@/components/business/BeeBackHeader/index.vue'
import BeeCard from '@/components/layout/BeeCard/index.vue'
import BeePage from '@/components/layout/BeePage/index.vue'

defineOptions({ name: 'DeploymentCreate' })

const router = useRouter()

/** 返回上一页 */
function handleBack() {
  router.back()
}
</script>

<style lang="scss" scoped>
.deployment-create__placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  font-size: 16px;
  color: $color-text-secondary;
}
</style>
