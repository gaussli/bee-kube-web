<template>
  <BeePage>
    <!-- 页面 Header -->
    <BeeBackHeader :actions="actionItems" title="配置节点拓扑" @action="handleHeaderActions" @back="handleBack" />

    <!-- 表单 Body -->
    <BeeCard class="page-body">
      <BeeForm ref="formRef" class="page-form">
        <BeeFieldInput
          id="name"
          v-model="nodeNameText"
          class="grid-line"
          disabled
          icon="kubernetes-node"
          label="节点名称"
        />
        <!-- 已知拓扑键：键固定，只填值 -->
        <BeeFieldInput
          v-for="item in NODE_TOPOLOGY_KEYS"
          :id="item.key"
          :key="item.key"
          v-model="topologyValues[item.key]"
          icon="kubernetes-topology"
          :label="item.label"
          :max-length="63"
          :tip="item.tip"
          :validator="validateLabelValue"
        />
        <!-- 自定义拓扑键：键与值均可编辑，覆盖 region / zone 之外的拓扑标签 -->
        <BeeKeyValueEditor
          v-model="customItems"
          class="grid-line"
          icon="kubernetes-topology"
          :key-validator="validateMetadataKey"
          label="其它拓扑标签"
          occupied-key-message="该键已在「区域 / 可用区」中配置"
          :occupied-keys="KNOWN_TOPOLOGY_KEYS"
          tip="用于区域 / 可用区之外的拓扑标签（例如自定义机架 topology.example.com/rack）：键需符合标签键格式，值为空的条目不会提交。"
          :value-max-length="63"
          :value-validator="validateLabelValue"
        />
      </BeeForm>
    </BeeCard>
  </BeePage>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'

import { useRoute, useRouter } from 'vue-router'

import type { KeyValueItem } from '@/components/business/BeeKeyValueEditor/types'

import { getNodeDetail, manageNodeTopology } from '@/api/kubernetes/node'

import { KubernetesRouteNames } from '@/router/names.ts'

import BeeFieldInput from '@/components/base/BeeFieldInput/index.vue'
import BeeForm from '@/components/base/BeeForm/index.vue'
import { BeeMessage } from '@/components/base/BeeMessage'
import BeeBackHeader, { type ActionItem } from '@/components/business/BeeBackHeader/index.vue'
import BeeKeyValueEditor from '@/components/business/BeeKeyValueEditor/index.vue'
import BeeCard from '@/components/layout/BeeCard/index.vue'
import BeePage from '@/components/layout/BeePage/index.vue'

import { useMetadataValidator } from '@/composables/useMetadataValidator'
import { METADATA_OPERATION } from '@/config/kubernetes/core'
import { NODE_TOPOLOGY_KEYS, TOPOLOGY_KEY_PREFIXES } from '@/config/kubernetes/node'

/**
 * 配置节点拓扑
 * @description 拓扑数据是 `Record<拓扑键, 值>`，但拓扑键是 K8s 的标签键，因此页面分两部分：
 * 已知拓扑键（区域 / 可用区）只填值，避免常用键被写错；其余拓扑标签用键值编辑器，支持自定义键。
 * 提交时合并为 `Record<键, 值>`，值为空的键不提交
 */
defineOptions({ name: 'NodeManageTopologies' })

const route = useRoute()
const router = useRouter()
const { validateMetadataKey, validateLabelValue } = useMetadataValidator()

/** 已知拓扑键集合，用于自定义条目排除重复 */
const KNOWN_TOPOLOGY_KEYS = NODE_TOPOLOGY_KEYS.map(item => item.key)

// ==================== Reactive State ====================
/** 表单实例，提交按钮在本组件之外，通过 ref 调用校验 */
const formRef = ref<InstanceType<typeof BeeForm>>()
/** 已知拓扑键对应的值 */
const topologyValues = reactive<Record<string, string>>({})
/** 其它拓扑标签条目（节点上已存在的 + 用户自定义的） */
const customItems = ref<KeyValueItem[]>([])
/** 是否正在加载详情 */
const isLoading = ref<boolean>(false)
/** 是否正在提交 */
const isSubmitting = ref<boolean>(false)

// ==================== Computed ====================
/** 所属集群 UID（路由参数） */
const clusterUid = computed(() => route.params.clusterUid as string)
/** 被配置节点名称（路由参数） */
const nodeName = computed(() => route.params.name as string)
/** 节点名称只读展示值 */
const nodeNameText = ref(nodeName.value)
/** 头部操作按钮组：加载详情期间禁用，提交期间展示加载态 */
const actionItems = computed<ActionItem[]>(() => [
  {
    value: 'submit',
    label: '提交',
    icon: 'basic-right',
    type: 'success',
    disabled: isLoading.value,
    loading: isSubmitting.value,
  },
])

// ==================== Method ====================
/**
 * 判断标签键是否为拓扑标签键
 * @param key - 标签键
 * @returns 是否属于拓扑标签
 */
function isTopologyKey(key: string): boolean {
  return TOPOLOGY_KEY_PREFIXES.some(prefix => key.startsWith(prefix))
}

/**
 * 获取节点详情并回填拓扑
 * @description 已知拓扑键回填到固定行；节点上其它以拓扑前缀开头的标签回填到自定义条目，
 * 避免全量替换时丢掉未展示的拓扑标签
 */
async function fetchNodeTopologies() {
  isLoading.value = true
  try {
    const detail = await getNodeDetail(clusterUid.value, nodeName.value)
    const labels = detail.labels ?? {}
    for (const item of NODE_TOPOLOGY_KEYS) {
      topologyValues[item.key] = labels[item.key] ?? ''
    }
    customItems.value = Object.keys(labels)
      .filter(key => isTopologyKey(key) && !KNOWN_TOPOLOGY_KEYS.includes(key))
      .map(key => ({ key, value: labels[key] ?? '' }))
  } catch {
    BeeMessage.error('加载节点拓扑失败')
    router.back()
  } finally {
    isLoading.value = false
  }
}

/**
 * 构建拓扑键值对
 * @description 值为空或不完整的条目都不提交（全量替换语义下即不设置该拓扑标签）
 * @returns 拓扑键值对
 */
function buildTopologies(): Record<string, string> {
  const topologies: Record<string, string> = {}
  for (const item of NODE_TOPOLOGY_KEYS) {
    const value = topologyValues[item.key]
    if (value) topologies[item.key] = value
  }
  for (const item of customItems.value) {
    if (!item.key || !item.value) continue
    topologies[item.key] = item.value
  }
  return topologies
}

/**
 * 提交拓扑配置
 * @description 先聚合校验表单，失败时提示并聚焦首个错误字段；成功后返回节点列表
 */
async function handleSubmit() {
  const result = formRef.value?.validate()
  if (result && !result.valid) {
    BeeMessage.error(result.firstError ?? '请检查表单填写')
    return
  }
  isSubmitting.value = true
  try {
    await manageNodeTopology(clusterUid.value, nodeName.value, {
      topologies: buildTopologies(),
      operation: METADATA_OPERATION.Replace,
    })
  } catch {
    BeeMessage.error('配置节点拓扑失败')
    return
  } finally {
    isSubmitting.value = false
  }
  BeeMessage.success('配置成功')
  await router.push({ name: KubernetesRouteNames.Node.List, params: { clusterUid: clusterUid.value } })
}

// ==================== Handler ====================
/**
 * 处理页面返回
 */
function handleBack() {
  router.back()
}

/**
 * 处理操作按钮组逻辑
 * @param value - 操作标识
 */
async function handleHeaderActions(value: string) {
  switch (value) {
    case 'submit': {
      await handleSubmit()
      break
    }
  }
}

// ==================== Lifecycle ====================
onMounted(() => {
  void fetchNodeTopologies()
})
</script>

<style lang="scss" scoped>
.page-body {
  display: flex;
  gap: 16px;
  flex-direction: column;
  flex: 1;
  padding: 16px;
  overflow: hidden auto;

  .page-form {
    display: grid;
    gap: 24px;
    grid-template-columns: 1fr 1fr;

    > .grid-line {
      grid-column: 1 / 3;
    }
  }
}
</style>
