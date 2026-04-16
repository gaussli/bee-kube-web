<template>
  <div class="menu-info">
    <div class="menu-left">
      <el-icon :size="24" class="menu-icon">
        <component :is="iconComponent" />
      </el-icon>
    </div>
    <div class="menu-detail">
      <div class="menu-name">{{ name }}</div>
      <div class="menu-code">{{ code }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

defineOptions({ name: 'MenuCell' })

const props = defineProps<{
  code: string
  name: string
  icon?: string
}>()

const iconComponent = computed(() => {
  if (props.icon && ElementPlusIconsVue[props.icon as keyof typeof ElementPlusIconsVue]) {
    return ElementPlusIconsVue[props.icon as keyof typeof ElementPlusIconsVue]
  }
  return ElementPlusIconsVue['Folder']
})
</script>

<style lang="scss" scoped>
.menu-info {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  height: 42px;

  .menu-left {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .menu-icon {
    color: #303133;
  }

  .menu-detail {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 2px;
    min-width: 0;

    .menu-name {
      font-size: 14px;
      font-weight: 600;
      color: #303133;
      line-height: 1.2;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .menu-code {
      font-size: 12px;
      color: #909399;
      line-height: 1.2;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
