<template>
  <div class="deployment-network">
    {{ tabName }}
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'DeploymentNetwork' })

const tabName = '关联网络'
</script>

<style lang="scss" scoped>
.deployment-network {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 24px;
  color: $color-text-secondary;
}
</style>
