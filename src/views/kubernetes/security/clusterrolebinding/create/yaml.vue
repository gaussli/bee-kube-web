<template>
  <BeePage class="cluster-role-binding-create-yaml">
    <BeeBackHeader title="创建ClusterRoleBinding YAML" @back="handleBack" />
    <BeeCard class="cluster-role-binding-create-yaml__placeholder"> 创建ClusterRoleBinding YAML </BeeCard>
  </BeePage>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

import BeeBackHeader from '@/components/business/BeeBackHeader/index.vue'
import BeeCard from '@/components/layout/BeeCard/index.vue'
import BeePage from '@/components/layout/BeePage/index.vue'

defineOptions({ name: 'ClusterRoleBindingCreateYaml' })

const router = useRouter()

/** 返回上一页 */
function handleBack() {
  router.back()
}
</script>

<style lang="scss" scoped>
.cluster-role-binding-create-yaml__placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  font-size: 16px;
  color: $color-text-secondary;
}
</style>
