<template>
  <div class="deployment-monitor">
    {{ tabName }}
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'DeploymentMonitor' })

const tabName = '监控数据'
</script>

<style lang="scss" scoped>
.deployment-monitor {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 24px;
  color: $color-text-secondary;
}
</style>
