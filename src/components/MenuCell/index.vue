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
  gap: $spacing-8;
  align-items: center;
  height: 42px;

  .menu-left {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
  }

  .menu-icon {
    color: $color-primary;
  }

  .menu-detail {
    display: flex;
    gap: 2px;
    flex-direction: column;
    justify-content: center;
    min-width: 0;

    .menu-name {
      overflow: hidden;
      font-size: 14px;
      font-weight: 600;
      line-height: 1.2;
      color: $text-primary;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .menu-code {
      overflow: hidden;
      font-size: 12px;
      line-height: 1.2;
      color: $text-secondary;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
