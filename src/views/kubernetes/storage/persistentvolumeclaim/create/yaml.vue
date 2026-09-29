<template>
  <BeePage class="persistent-volume-claim-create-yaml">
    <BeeBackHeader title="创建PersistentVolumeClaim YAML" @back="handleBack" />
    <BeeCard class="persistent-volume-claim-create-yaml__placeholder"> 创建PersistentVolumeClaim YAML </BeeCard>
  </BeePage>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

import BeeBackHeader from '@/components/business/BeeBackHeader/index.vue'
import BeeCard from '@/components/layout/BeeCard/index.vue'
import BeePage from '@/components/layout/BeePage/index.vue'

defineOptions({ name: 'PersistentVolumeClaimCreateYaml' })

const router = useRouter()

/** 返回上一页 */
function handleBack() {
  router.back()
}
</script>

<style lang="scss" scoped>
.persistent-volume-claim-create-yaml__placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  font-size: 16px;
  color: $color-text-secondary;
}
</style>
