<template>
  <div class="deployment-events">
    {{ tabName }}
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'DeploymentEvents' })

const tabName = '事件信息'
</script>

<style lang="scss" scoped>
.deployment-events {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 24px;
  color: $color-text-secondary;
}
</style>
