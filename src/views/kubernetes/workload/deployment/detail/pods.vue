<template>
  <div class="deployment-pods">
    {{ tabName }}
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'DeploymentPods' })

const tabName = '容器组'
</script>

<style lang="scss" scoped>
.deployment-pods {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 24px;
  color: $color-text-secondary;
}
</style>
