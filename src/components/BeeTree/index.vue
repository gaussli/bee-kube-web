<template>
  <div class="bee-tree" role="tree">
    <BeeTreeNode
      v-for="node in data"
      :key="node[nodeKey]"
      :node="node"
      :node-key="nodeKey"
      :checked-keys="checkedKeys"
      :half-checked-keys="halfCheckedKeys"
      :disabled="disabled"
      :selected-key="selectedKey"
      :expand-all="defaultExpandAll"
      :expanded-keys="expandedKeys"
      @toggle="handleToggle"
      @check="handleCheck"
      @select="handleSelect"
    >
      <template v-for="(_, name) in $slots" #[name]="slotData">
        <slot :name="name" v-bind="slotData || {}" />
      </template>
    </BeeTreeNode>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import BeeTreeNode from './BeeTreeNode.vue'

export interface BeeTreeNodeData {
  id: string | number
  label?: string
  disabled?: boolean
  children?: BeeTreeNodeData[]
  [key: string]: any
}

interface BeeTreeProps {
  data?: BeeTreeNodeData[]
  modelValue?: (string | number)[]
  defaultExpandAll?: boolean
  defaultCheckedKeys?: (string | number)[]
  defaultExpandedKeys?: (string | number)[]
  disabled?: boolean
  nodeKey?: string
}

const props = withDefaults(defineProps<BeeTreeProps>(), {
  data: () => [],
  modelValue: () => [],
  defaultExpandAll: true,
  defaultCheckedKeys: () => [],
  defaultExpandedKeys: () => [],
  disabled: false,
  nodeKey: 'id'
})

const emit = defineEmits<{
  'update:modelValue': [value: (string | number)[]]
  'check': [keys: (string | number)[], nodes: BeeTreeNodeData[]]
  'select': [key: string | number | null, node: BeeTreeNodeData | null]
  'toggle': [key: string | number]
}>()

const nodeKey = props.nodeKey
const checkedKeys = ref<(string | number)[]>([...props.modelValue])
const halfCheckedKeys = ref<(string | number)[]>([])
const selectedKey = ref<string | number | null>(null)
const expandedKeys = ref<(string | number)[]>([...props.defaultExpandedKeys])

// 初始化
if (props.defaultCheckedKeys.length > 0 && props.modelValue.length === 0) {
  checkedKeys.value = [...props.defaultCheckedKeys]
}

// 监听外部值变化
watch(
  () => props.modelValue,
  newVal => {
    if (JSON.stringify(newVal) !== JSON.stringify(checkedKeys.value)) {
      checkedKeys.value = [...newVal]
    }
  },
  { deep: true }
)

// 扁平化所有节点
function flattenNodes(nodes: BeeTreeNodeData[]): BeeTreeNodeData[] {
  const result: BeeTreeNodeData[] = []
  const traverse = (list: BeeTreeNodeData[]) => {
    for (const node of list) {
      const { children, ...rest } = node
      result.push(rest)
      if (children && children.length > 0) {
        traverse(children)
      }
    }
  }
  traverse(nodes)
  return result
}

// 获取节点的所有祖先 key
function getAncestorKeys(key: string | number, nodes: BeeTreeNodeData[]): (string | number)[] {
  const ancestorKeys: (string | number)[] = []
  const findAncestor = (list: BeeTreeNodeData[], target: string | number) => {
    for (const node of list) {
      if (node.children?.some(child => child[nodeKey] === target)) {
        ancestorKeys.push(node[nodeKey])
        findAncestor(nodes, node[nodeKey])
        return
      }
      if (node.children) {
        findAncestor(node.children, target)
      }
    }
  }
  findAncestor(nodes, key)
  return ancestorKeys
}

// 获取节点的所有子节点 key
function getDescendantKeys(key: string | number, nodes: BeeTreeNodeData[]): (string | number)[] {
  const descendantKeys: (string | number)[] = []
  const findDescendants = (list: BeeTreeNodeData[], parentKey: string | number) => {
    for (const node of list) {
      if (node[nodeKey] === parentKey && node.children) {
        for (const child of node.children) {
          descendantKeys.push(child[nodeKey])
          findDescendants(nodes, child[nodeKey])
        }
        return
      }
      if (node.children) {
        findDescendants(node.children, parentKey)
      }
    }
  }
  findDescendants(nodes, key)
  return descendantKeys
}

// 更新半选中状态
function updateHalfCheckedKeys() {
  const newHalfChecked: (string | number)[] = []

  for (const key of checkedKeys.value) {
    const ancestors = getAncestorKeys(key, props.data)
    for (const ancestor of ancestors) {
      if (!checkedKeys.value.includes(ancestor) && !newHalfChecked.includes(ancestor)) {
        newHalfChecked.push(ancestor)
      }
    }
  }

  halfCheckedKeys.value = newHalfChecked
}

function handleToggle(key: string | number) {
  const index = expandedKeys.value.indexOf(key)
  if (index > -1) {
    expandedKeys.value.splice(index, 1)
  } else {
    expandedKeys.value.push(key)
  }
  emit('toggle', key)
}

function handleCheck(key: string | number, checked: boolean) {
  if (checked) {
    if (!checkedKeys.value.includes(key)) {
      checkedKeys.value.push(key)
    }
    // 选中父节点时，选中所有子节点
    const descendants = getDescendantKeys(key, props.data)
    for (const descKey of descendants) {
      if (!checkedKeys.value.includes(descKey)) {
        checkedKeys.value.push(descKey)
      }
    }
    // 选中子节点时，选中所有祖先节点（半选）
    const ancestors = getAncestorKeys(key, props.data)
    for (const ancKey of ancestors) {
      if (!checkedKeys.value.includes(ancKey)) {
        halfCheckedKeys.value.push(ancKey)
      }
    }
  } else {
    // 取消选中时，移除所有后代节点
    const descendants = getDescendantKeys(key, props.data)
    checkedKeys.value = checkedKeys.value.filter(k => k !== key && !descendants.includes(k))
    // 移除后代节点的半选状态
    for (const descKey of descendants) {
      const index = halfCheckedKeys.value.indexOf(descKey)
      if (index > -1) {
        halfCheckedKeys.value.splice(index, 1)
      }
    }
    // 检查是否需要保留祖先的半选状态
    for (const ancKey of halfCheckedKeys.value) {
      const ancDescendants = getDescendantKeys(ancKey, props.data)
      if (!ancDescendants.some(d => checkedKeys.value.includes(d))) {
        const idx = halfCheckedKeys.value.indexOf(ancKey)
        if (idx > -1) {
          halfCheckedKeys.value.splice(idx, 1)
        }
      }
    }
  }

  // 清理已选中的祖先的半选状态
  halfCheckedKeys.value = halfCheckedKeys.value.filter(k => !checkedKeys.value.includes(k))

  emit('update:modelValue', [...checkedKeys.value])
  emit(
    'check',
    [...checkedKeys.value],
    flattenNodes(props.data).filter(n => checkedKeys.value.includes(n[nodeKey]))
  )
}

function handleSelect(key: string | number | null) {
  selectedKey.value = key
  const node = key ? flattenNodes(props.data).find(n => n[nodeKey] === key) : null
  emit('select', key, node || null)
}

// 公开方法
function getCheckedKeys(): (string | number)[] {
  return [...checkedKeys.value]
}

function getCheckedNodes(): BeeTreeNodeData[] {
  return flattenNodes(props.data).filter(n => checkedKeys.value.includes(n[nodeKey]))
}

function getHalfCheckedKeys(): (string | number)[] {
  return [...halfCheckedKeys.value]
}

function setCheckedKeys(keys: (string | number)[]): void {
  checkedKeys.value = [...keys]
  updateHalfCheckedKeys()
}

function setChecked(key: string | number, checked: boolean): void {
  handleCheck(key, checked)
}

function expandAll(): void {
  const allKeys = flattenNodes(props.data).map(n => n[nodeKey])
  expandedKeys.value = allKeys
}

function collapseAll(): void {
  expandedKeys.value = []
}

defineExpose({
  getCheckedKeys,
  getCheckedNodes,
  getHalfCheckedKeys,
  setCheckedKeys,
  setChecked,
  expandAll,
  collapseAll
})
</script>

<style lang="scss" scoped>
.bee-tree {
  background: transparent;
  user-select: none;
}
</style>
