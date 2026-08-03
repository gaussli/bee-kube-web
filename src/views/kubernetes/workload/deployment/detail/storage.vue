<template>
  <div class="deployment-storage">
    {{ tabName }}
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'DeploymentStorage' })

const tabName = '挂载存储'
</script>

<style lang="scss" scoped>
.deployment-storage {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 24px;
  color: $color-text-secondary;
}
</style>
