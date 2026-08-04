<template>
  <BeePage class="deployment-edit">
    <BeeBackHeader title="编辑Deployment" @back="handleBack" />
    <BeeCard class="deployment-edit__placeholder"> 编辑Deployment </BeeCard>
  </BeePage>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

import BeeBackHeader from '@/components/BeeBackHeader/index.vue'
import BeeCard from '@/components/BeeCard/index.vue'
import BeePage from '@/components/BeePage/index.vue'

defineOptions({ name: 'DeploymentEdit' })

const router = useRouter()

/** 返回上一页 */
function handleBack() {
  router.back()
}
</script>

<style lang="scss" scoped>
.deployment-edit__placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  font-size: 16px;
  color: $color-text-secondary;
}
</style>
