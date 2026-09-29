<template>
  <BeePage class="persistent-volume-edit-yaml">
    <BeeBackHeader title="编辑PersistentVolume YAML" @back="handleBack" />
    <BeeCard class="persistent-volume-edit-yaml__placeholder"> 编辑PersistentVolume YAML </BeeCard>
  </BeePage>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

import BeeBackHeader from '@/components/business/BeeBackHeader/index.vue'
import BeeCard from '@/components/layout/BeeCard/index.vue'
import BeePage from '@/components/layout/BeePage/index.vue'

defineOptions({ name: 'PersistentVolumeEditYaml' })

const router = useRouter()

/** 返回上一页 */
function handleBack() {
  router.back()
}
</script>

<style lang="scss" scoped>
.persistent-volume-edit-yaml__placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  font-size: 16px;
  color: $color-text-secondary;
}
</style>
