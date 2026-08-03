<template>
  <div class="deployment-yaml">
    {{ tabName }}
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'DeploymentYaml' })

const tabName = 'YAML'
</script>

<style lang="scss" scoped>
.deployment-yaml {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 24px;
  color: $color-text-secondary;
}
</style>
