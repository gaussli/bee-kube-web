<template>
  <BeePage>
    <!-- 页面 Header -->
    <BeeBackHeader :actions="actionItems" title="创建配置映射" @action="handleHeaderActions" @back="handleBack" />

    <!-- 表单 Body -->
    <BeeCard class="page-body">
      <BeeForm ref="formRef" class="page-form">
        <BeeFieldSelect
          v-model="formData.namespace"
          icon="kubernetes-namespace"
          label="命名空间"
          :options="namespaceOptions"
          required
          tip="配置映射所属的命名空间"
          :validator="validateNamespace"
        />
        <BeeFieldInput
          id="name"
          v-model="formData.name"
          icon="kubernetes-configmap"
          label="名称"
          required
          tip="名称只能包含小写字母、数字和 -，且必须以字母或数字开头和结尾，最长 63 个字符。"
          :validator="validateName"
        />
        <BeeFieldTextarea
          id="desc"
          v-model="formData.description"
          class="grid-line"
          icon="basic-description"
          label="描述"
          :max-length="255"
          :rows="3"
          tip="描述长度不能超过 255 个字符"
          :validator="validateDescription"
        />
        <BeeKeyValueEditor
          v-model="dataItems"
          class="grid-line"
          :key-validator="validateDataKey"
          label="配置数据"
          tip="键只能包含字母、数字、-、_、.，值以明文保存；提交后将以当前内容全量覆盖现有数据。"
        />
        <BeeKeyValueEditor
          v-model="binaryDataItems"
          class="grid-line"
          :key-validator="validateDataKey"
          label="二进制数据"
          occupied-key-message="键与「配置数据」重复"
          :occupied-keys="dataKeys"
          tip="值需为 Base64 编码的二进制内容；键不能与「配置数据」重复。"
        />
        <BeeSwitch
          v-model="formData.immutable"
          icon="basic-switch"
          label="不可变（immutable）"
          tip="开启后配置数据与二进制数据不可再更新，仅元数据可修改。"
        />
        <BeeKeyValueEditor
          v-model="labelItems"
          class="grid-line"
          icon="kubernetes-label"
          :key-validator="validateMetadataKey"
          label="标签"
          :value-max-length="63"
          :value-validator="validateLabelValue"
        />
        <BeeKeyValueEditor
          v-model="annotationItems"
          class="grid-line"
          icon="kubernetes-annotation"
          :key-validator="validateMetadataKey"
          label="注解"
        />
      </BeeForm>
    </BeeCard>
  </BeePage>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'

import { useRoute, useRouter } from 'vue-router'

import type { ConfigMapCreateForm } from '@/types/kubernetes/config/configmap'

import type { SelectOption } from '@/components/base/BeeSelect/types'

import { createConfigMap } from '@/api/kubernetes/config/configmap'
import { getNamespaceList } from '@/api/kubernetes/namespace/namespace'

import { KubernetesRouteNames } from '@/router/names.ts'

import BeeFieldInput from '@/components/base/BeeFieldInput/index.vue'
import BeeFieldSelect from '@/components/base/BeeFieldSelect/index.vue'
import BeeFieldTextarea from '@/components/base/BeeFieldTextarea/index.vue'
import BeeForm from '@/components/base/BeeForm/index.vue'
import { BeeMessage } from '@/components/base/BeeMessage'
import BeeSwitch from '@/components/base/BeeSwitch/index.vue'
import BeeBackHeader, { type ActionItem } from '@/components/business/BeeBackHeader/index.vue'
import BeeKeyValueEditor from '@/components/business/BeeKeyValueEditor/index.vue'
import {
  isBlankKeyValueItem,
  keyValueItemsToRecord,
  type KeyValueItem,
} from '@/components/business/BeeKeyValueEditor/types'
import BeeCard from '@/components/layout/BeeCard/index.vue'
import BeePage from '@/components/layout/BeePage/index.vue'

import { useMetadataValidator } from '@/composables/useMetadataValidator'

import { useValidator } from '../../composables/useValidator'

defineOptions({ name: 'ConfigMapCreate' })

const route = useRoute()
const router = useRouter()
const { validateName, validateDescription, validateDataKey, validateNamespace } = useValidator()
const { validateMetadataKey, validateLabelValue } = useMetadataValidator()

// ==================== Reactive State ====================
/** 表单实例，提交按钮在本组件之外，通过 ref 调用校验 */
const formRef = ref<InstanceType<typeof BeeForm>>()
/** 表单数据 */
const formData = reactive<{ namespace: string; name: string; description: string; immutable: boolean }>({
  namespace: '',
  name: '',
  description: '',
  immutable: false,
})
/** 配置数据条目 */
const dataItems = ref<KeyValueItem[]>([])
/** 二进制数据条目 */
const binaryDataItems = ref<KeyValueItem[]>([])
/** 标签条目 */
const labelItems = ref<KeyValueItem[]>([])
/** 注解条目 */
const annotationItems = ref<KeyValueItem[]>([])
/** 命名空间下拉选项 */
const namespaceOptions = ref<SelectOption[]>([])
/** 是否正在提交 */
const isSubmitting = ref<boolean>(false)

// ==================== Computed ====================
/** 所属集群 UID（路由参数） */
const clusterUid = computed(() => route.params.clusterUid as string)
/** 配置数据键集合，用于校验二进制数据键不重叠 */
const dataKeys = computed(() => dataItems.value.filter(item => !isBlankKeyValueItem(item)).map(item => item.key))
/** 头部操作按钮组：提交期间展示加载态 */
const actionItems = computed<ActionItem[]>(() => [
  {
    value: 'submit',
    label: '创建',
    icon: 'basic-right',
    type: 'success',
    loading: isSubmitting.value,
  },
])

// ==================== Method ====================
/**
 * 请求命名空间下拉选项
 */
async function fetchNamespaceOptions() {
  if (!clusterUid.value) return
  try {
    const { list } = await getNamespaceList(clusterUid.value, { mode: 'Simple' })
    namespaceOptions.value = list.map(item => ({ label: item.name, value: item.name }))
  } catch {
    BeeMessage.error('加载命名空间选项失败')
  }
}

/**
 * 构建创建请求数据
 * @returns 创建请求对象
 */
function buildFormData(): Partial<ConfigMapCreateForm> {
  return {
    namespace: formData.namespace,
    name: formData.name,
    description: formData.description || undefined,
    immutable: formData.immutable,
    data: keyValueItemsToRecord(dataItems.value),
    binaryData: keyValueItemsToRecord(binaryDataItems.value),
    labels: keyValueItemsToRecord(labelItems.value),
    annotations: keyValueItemsToRecord(annotationItems.value),
  }
}

/**
 * 提交创建
 * @description 先聚合校验表单，失败时提示并聚焦首个错误字段；成功后返回配置映射列表
 */
async function handleSubmit() {
  const result = formRef.value?.validate()
  if (result && !result.valid) {
    BeeMessage.error(result.firstError ?? '请检查表单填写')
    return
  }
  isSubmitting.value = true
  try {
    await createConfigMap(clusterUid.value, buildFormData())
  } catch {
    BeeMessage.error('创建配置映射失败')
    return
  } finally {
    isSubmitting.value = false
  }
  BeeMessage.success('创建成功')
  await router.push({ name: KubernetesRouteNames.ConfigMap.List, params: { clusterUid: clusterUid.value } })
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
  void fetchNamespaceOptions()
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
