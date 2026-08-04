<template>
  <div class="deployment-scheduling">
    {{ tabName }}
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'DeploymentScheduling' })

const tabName = '调度策略'
</script>

<style lang="scss" scoped>
.deployment-scheduling {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 24px;
  color: $color-text-secondary;
}
</style>
