<template>
  <div class="bee-tree-node" role="treeitem" :aria-expanded="isExpanded">
    <div
      class="bee-tree-node__content"
      :class="{ 'is-selected': isSelected, 'is-disabled': isNodeDisabled }"
      :style="{ paddingLeft: `${level * indent}px` }"
      @click="handleContentClick"
    >
      <!-- 展开/折叠图标 -->
      <span
        v-if="hasChildren"
        class="bee-tree-node__expand-icon"
        :class="{ 'is-expanded': isExpanded }"
        @click.stop="handleToggle"
      >
        <el-icon><CaretRight /></el-icon>
      </span>
      <span v-else class="bee-tree-node__expand-icon is-leaf" />

      <!-- 复选框 -->
      <el-checkbox
        v-if="showCheckbox"
        :model-value="isChecked"
        :indeterminate="isHalfChecked"
        :disabled="isNodeDisabled"
        @change="handleCheck"
        @click.stop
      />

      <!-- 节点内容 -->
      <div class="bee-tree-node__label" @click.stop="handleSelect">
        <slot :data="node" :node="node">
          {{ node.label || node.name }}
        </slot>
      </div>
    </div>

    <!-- 子节点 -->
    <div v-if="hasChildren && isExpanded" class="bee-tree-node__children" role="group">
      <BeeTreeNode
        v-for="child in node.children"
        :key="child[nodeKey]"
        :node="child"
        :node-key="nodeKey"
        :checked-keys="checkedKeys"
        :half-checked-keys="halfCheckedKeys"
        :disabled="disabled"
        :selected-key="selectedKey"
        :level="level + 1"
        :indent="indent"
        :show-checkbox="showCheckbox"
        :expand-all="expandAll"
        :expanded-keys="expandedKeys"
        @toggle="$emit('toggle', $event)"
        @check="handleChildCheck"
        @select="$emit('select', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { CaretRight } from '@element-plus/icons-vue'

import type { BeeTreeNodeData } from './index.vue'

interface Props {
  node: BeeTreeNodeData
  nodeKey: string
  checkedKeys: (string | number)[]
  halfCheckedKeys: (string | number)[]
  disabled: boolean
  selectedKey: string | number | null
  level?: number
  indent?: number
  showCheckbox?: boolean
  expandAll?: boolean
  expandedKeys?: (string | number)[]
}

const props = withDefaults(defineProps<Props>(), {
  level: 0,
  indent: 16,
  showCheckbox: true,
  expandAll: false,
  expandedKeys: () => [],
})

const emit = defineEmits<{
  toggle: [key: string | number]
  check: [key: string | number, checked: boolean]
  select: [key: string | number | null]
}>()

const key = computed(() => props.node[props.nodeKey])

const hasChildren = computed(() => props.node.children && props.node.children.length > 0)

const isNodeDisabled = computed(() => props.disabled || props.node.disabled === true)

const isChecked = computed(() => props.checkedKeys.includes(key.value))

const isHalfChecked = computed(() => props.halfCheckedKeys.includes(key.value))

const isExpanded = computed(() => {
  // 如果 expandAll 为 true 且 expandedKeys 不包含该 key，默认展开
  if (props.expandAll) {
    return props.expandedKeys.includes(key.value) || props.expandedKeys.length === 0
  }
  return props.expandedKeys.includes(key.value)
})

const isSelected = computed(() => props.selectedKey === key.value)

function handleToggle() {
  emit('toggle', key.value)
}

function handleCheck() {
  emit('check', key.value, !isChecked.value)
}

function handleChildCheck(key: string | number, checked: boolean) {
  emit('check', key, checked)
}

function handleSelect() {
  emit('select', key.value)
}

function handleContentClick() {
  if (hasChildren.value) {
    handleToggle()
  }
}
</script>

<style lang="scss" scoped>
.bee-tree-node {
  &__content {
    display: flex;
    align-items: center;
    height: 32px;
    padding-right: 8px;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: rgba($color-primary, 0.04);
    }

    &.is-selected {
      background-color: rgba($color-primary, 0.08);
    }

    &.is-disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  &__expand-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    font-size: 12px;
    color: $color-text-tertiary;
    transition: transform 0.3s ease;

    &.is-leaf {
      visibility: hidden;
    }

    &.is-expanded {
      transform: rotate(90deg);
    }

    .el-icon {
      font-size: inherit;
    }
  }

  &__label {
    flex: 1;
    min-width: 0;
    font-size: 14px;
    color: $color-text-primary;
  }

  &__children {
    // 子节点样式由父级控制
  }
}

// 复选框样式
:deep(.el-checkbox) {
  margin-right: 8px;

  .el-checkbox__inner {
    border-radius: 4px;
  }

  &.is-checked {
    .el-checkbox__inner {
      border-color: $color-primary;
      background-color: $color-primary;
    }
  }

  &.is-indeterminate {
    .el-checkbox__inner {
      border-color: $color-primary;
      background-color: $color-primary;

      &::before {
        bottom: 0;
        height: 2px;
        background-color: #fff;
      }
    }
  }

  &.is-disabled {
    .el-checkbox__inner {
      border-color: rgba($color-text-tertiary, 0.3);
      background-color: rgba($color-text-tertiary, 0.2);
    }
  }
}
</style>
