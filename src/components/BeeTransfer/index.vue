<template>
  <div class="bee-transfer">
    <!-- 左侧列表 -->
    <div class="transfer-panel transfer-panel-left">
      <div class="panel-header">
        <el-checkbox v-model="leftCheckedAll" :indeterminate="leftIndeterminate" @change="handleLeftCheckAll" />
        <span class="header-title">{{ leftTitle }}</span>
        <span class="header-count">{{ leftSelectedCount }} / {{ leftData.length }}</span>
        <BeeInputSearch v-model="leftSearch" placeholder="搜索" size="default" class="header-search" />
      </div>
      <div class="panel-body">
        <div
          v-for="item in leftFilteredData"
          :key="getItemKey(item)"
          class="panel-item"
          :class="{ 'is-checked': leftCheckedKeys.has(getItemKey(item)) }"
          @click="handleLeftItemClick(item)"
        >
          <slot name="left" :item="item">
            <el-checkbox
              :model-value="leftCheckedKeys.has(getItemKey(item))"
              @click.stop
              @change="handleLeftItemCheck(item)"
            />
            <span class="item-label">{{ getItemLabel(item) }}</span>
          </slot>
        </div>
        <div v-if="leftFilteredData.length === 0" class="panel-empty">
          {{ leftSearch ? '无匹配结果' : '暂无数据' }}
        </div>
      </div>
    </div>

    <!-- 中间操作按钮 -->
    <div class="transfer-operate">
      <BeeButton :disabled="rightCheckedKeys.size === 0" size="small" @click="handleMoveToLeft">
        <template #icon><ArrowLeft /></template>
      </BeeButton>
      <div></div>
      <BeeButton :disabled="leftCheckedKeys.size === 0" size="small" @click="handleMoveToRight">
        <template #icon><ArrowRight /></template>
      </BeeButton>
    </div>

    <!-- 右侧列表 -->
    <div class="transfer-panel transfer-panel-right">
      <div class="panel-header">
        <el-checkbox v-model="rightCheckedAll" :indeterminate="rightIndeterminate" @change="handleRightCheckAll" />
        <span class="header-title">{{ rightTitle }}</span>
        <span class="header-count">{{ rightSelectedCount }} / {{ rightData.length }}</span>
        <BeeInputSearch v-model="rightSearch" placeholder="搜索" size="default" class="header-search" />
      </div>
      <div class="panel-body">
        <div
          v-for="item in rightFilteredData"
          :key="getItemKey(item)"
          class="panel-item"
          :class="{ 'is-checked': rightCheckedKeys.has(getItemKey(item)) }"
          @click="handleRightItemClick(item)"
        >
          <slot name="right" :item="item">
            <el-checkbox
              :model-value="rightCheckedKeys.has(getItemKey(item))"
              @click.stop
              @change="handleRightItemCheck(item)"
            />
            <span class="item-label">{{ getItemLabel(item) }}</span>
          </slot>
        </div>
        <div v-if="rightFilteredData.length === 0" class="panel-empty">
          {{ rightSearch ? '无匹配结果' : '暂无数据' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'

import BeeButton from '@/components/BeeButton/index.vue'
import BeeInputSearch from '@/components/BeeInputSearch/index.vue'

defineOptions({ name: 'BeeTransfer' })

const props = withDefaults(
  defineProps<{
    modelValue: string[]
    leftData: Record<string, any>[]
    rightData: Record<string, any>[]
    leftTitle?: string
    rightTitle?: string
    labelKey?: string
    valueKey?: string
  }>(),
  {
    leftTitle: '列表一',
    rightTitle: '列表二',
    labelKey: 'label',
    valueKey: 'value',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

const leftSearch = ref('')
const rightSearch = ref('')
const leftCheckedKeys = ref<Set<string>>(new Set())
const rightCheckedKeys = ref<Set<string>>(new Set())

function getItemKey(item: Record<string, any>): string {
  return String(item[props.valueKey])
}

function getItemLabel(item: Record<string, any>): string {
  return String(item[props.labelKey])
}

const leftFilteredData = computed(() => {
  if (!leftSearch.value) return props.leftData
  const search = leftSearch.value.toLowerCase()
  return props.leftData.filter(item => getItemLabel(item).toLowerCase().includes(search))
})

const rightFilteredData = computed(() => {
  if (!rightSearch.value) return props.rightData
  const search = rightSearch.value.toLowerCase()
  return props.rightData.filter(item => getItemLabel(item).toLowerCase().includes(search))
})

const leftSelectedCount = computed(() => leftCheckedKeys.value.size)

const rightSelectedCount = computed(() => rightCheckedKeys.value.size)

const leftIndeterminate = computed(() => {
  const checked = leftCheckedKeys.value.size
  return checked > 0 && checked < leftFilteredData.value.length
})

const rightIndeterminate = computed(() => {
  const checked = rightCheckedKeys.value.size
  return checked > 0 && checked < rightFilteredData.value.length
})

const leftCheckedAll = computed({
  get: () => leftFilteredData.value.length > 0 && leftCheckedKeys.value.size === leftFilteredData.value.length,
  set: () => {},
})

const rightCheckedAll = computed({
  get: () => rightFilteredData.value.size === rightFilteredData.value.length,
  set: () => {},
})

function handleLeftCheckAll(checked: boolean) {
  if (checked) {
    leftFilteredData.value.forEach(item => leftCheckedKeys.value.add(getItemKey(item)))
  } else {
    leftCheckedKeys.value.clear()
  }
}

function handleRightCheckAll(checked: boolean) {
  if (checked) {
    rightFilteredData.value.forEach(item => rightCheckedKeys.value.add(getItemKey(item)))
  } else {
    rightCheckedKeys.value.clear()
  }
}

function handleLeftItemClick(item: Record<string, any>) {
  const key = getItemKey(item)
  if (leftCheckedKeys.value.has(key)) {
    leftCheckedKeys.value.delete(key)
  } else {
    leftCheckedKeys.value.add(key)
  }
  leftCheckedKeys.value = new Set(leftCheckedKeys.value)
}

function handleRightItemClick(item: Record<string, any>) {
  const key = getItemKey(item)
  if (rightCheckedKeys.value.has(key)) {
    rightCheckedKeys.value.delete(key)
  } else {
    rightCheckedKeys.value.add(key)
  }
  rightCheckedKeys.value = new Set(rightCheckedKeys.value)
}

function handleLeftItemCheck(item: Record<string, any>) {
  handleLeftItemClick(item)
}

function handleRightItemCheck(item: Record<string, any>) {
  handleRightItemClick(item)
}

function handleMoveToRight() {
  const keysToMove = Array.from(leftCheckedKeys.value)
  const itemsToMove = props.leftData.filter(item => keysToMove.includes(getItemKey(item)))
  const newRightData = [...props.rightData, ...itemsToMove]
  emit(
    'update:modelValue',
    newRightData.map(item => getItemKey(item)),
  )
  leftCheckedKeys.value.clear()
}

function handleMoveToLeft() {
  // 保留所有未选中的项（不受搜索影响）
  const keysToRemove = new Set(rightCheckedKeys.value)
  const newRightData = props.rightData.filter(item => !keysToRemove.has(getItemKey(item)))
  emit(
    'update:modelValue',
    newRightData.map(item => getItemKey(item)),
  )
  rightCheckedKeys.value.clear()
}
</script>

<style lang="scss" scoped>
.bee-transfer {
  display: flex;
  gap: 16px;
  align-items: stretch;
  height: 100%;
  overflow: hidden;
}

.transfer-panel {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
  min-width: 200px;
  border: 1px solid rgba($color-text-secondary, 0.1);
  border-radius: 8px;
  overflow: hidden;
  background-color: $bg-overlay;
}

.panel-header {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid rgba($color-text-secondary, 0.1);
}

.header-title {
  flex-shrink: 0;
  font-size: 14px;
  font-weight: 500;
  color: $color-text-primary;
}

.header-count {
  flex-shrink: 0;
  margin-left: 8px;
  font-size: 12px;
  color: $color-text-secondary;
}

.header-search {
  flex-shrink: 0;
  width: 140px;
  margin-left: auto;

  :deep(.bee-input-search) {
    border: none;
    background-color: transparent;

    &:focus-within {
      border: none;
    }
  }
}

.panel-body {
  flex: 1;
  min-height: 0;
  padding: 8px;
  overflow-y: auto;
}

.panel-item {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 8px 12px;
  margin-bottom: 4px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:last-child {
    margin-bottom: 0;
  }

  &:hover {
    background-color: rgba($color-text-secondary, 0.05);
  }

  &.is-checked {
    background-color: rgba($color-primary, 0.1);
  }
}

.item-label {
  flex: 1;
  overflow: hidden;
  font-size: 14px;
  color: $color-text-primary;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.panel-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
  font-size: 13px;
  color: $color-text-secondary;
}

.transfer-operate {
  display: flex;
  gap: 8px;
  flex-direction: column;
  justify-content: center;
  padding: 16px 0;
}
</style>
