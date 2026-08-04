<template>
  <div class="deployment-history">
    {{ tabName }}
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'DeploymentHistory' })

const tabName = '部署历史'
</script>

<style lang="scss" scoped>
.deployment-history {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 24px;
  color: $color-text-secondary;
}
</style>
