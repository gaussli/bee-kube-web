<template>
  <div class="deployment-advanced">
    {{ tabName }}
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'DeploymentAdvanced' })

const tabName = '高级配置'
</script>

<style lang="scss" scoped>
.deployment-advanced {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 24px;
  color: $color-text-secondary;
}
</style>
