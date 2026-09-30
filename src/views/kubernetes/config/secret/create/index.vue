<template>
  <BeePage>
    <!-- 页面 Header -->
    <BeeBackHeader :actions="actionItems" title="创建密钥" @action="handleHeaderActions" @back="handleBack" />

    <!-- 表单 Body -->
    <BeeCard class="page-body">
      <BeeForm ref="formRef" class="page-form">
        <BeeFieldSelect
          v-model="formData.namespace"
          icon="kubernetes-namespace"
          label="命名空间"
          :options="namespaceOptions"
          required
          tip="密钥所属的命名空间"
          :validator="validateNamespace"
        />
        <BeeFieldInput
          id="name"
          v-model="formData.name"
          icon="kubernetes-secret"
          label="名称"
          required
          tip="名称只能包含小写字母、数字和 -，且必须以字母或数字开头和结尾，最长 63 个字符。"
          :validator="validateName"
        />
        <BeeFieldSelect
          v-model="formData.type"
          icon="basic-category"
          label="类型"
          :options="SECRET_TYPE_FORM_OPTIONS"
          required
          tip="密钥类型，决定 data 中必须包含的键（如 TLS 需 tls.crt 与 tls.key）。"
          :validator="validateSecretType"
        />
        <BeeSwitch
          v-model="formData.immutable"
          icon="basic-switch"
          label="不可变（immutable）"
          tip="开启后数据不可再更新，仅元数据可修改。"
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
          label="数据"
          tip="键只能包含字母、数字、-、_、.，值以明文提交，由 Kubernetes 编码后写入 data。"
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

import type { SecretCreateForm } from '@/types/kubernetes/config/secret'

import type { SelectOption } from '@/components/base/BeeSelect/types'

import { createSecret } from '@/api/kubernetes/config/secret'
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
import { keyValueItemsToRecord, type KeyValueItem } from '@/components/business/BeeKeyValueEditor/types'
import BeeCard from '@/components/layout/BeeCard/index.vue'
import BeePage from '@/components/layout/BeePage/index.vue'

import { useMetadataValidator } from '@/composables/useMetadataValidator'
import { SECRET_TYPE_FORM_OPTIONS, type SecretType } from '@/config/kubernetes/config/secret'

import { useValidator } from '../../composables/useValidator'

defineOptions({ name: 'SecretCreate' })

const route = useRoute()
const router = useRouter()
const { validateName, validateDescription, validateDataKey, validateNamespace } = useValidator()
const { validateMetadataKey, validateLabelValue } = useMetadataValidator()

// ==================== Reactive State ====================
/** 表单实例，提交按钮在本组件之外，通过 ref 调用校验 */
const formRef = ref<InstanceType<typeof BeeForm>>()
/** 表单数据（type 用 string 声明，避免下拉 v-model 与字面量联合类型的写入冲突，提交时再收窄） */
const formData = reactive<{
  namespace: string
  name: string
  type: string
  description: string
  immutable: boolean
}>({
  namespace: '',
  name: '',
  type: 'Opaque',
  description: '',
  immutable: false,
})
/** 数据条目：创建时以明文（stringData）提交 */
const dataItems = ref<KeyValueItem[]>([])
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
 * 校验密钥类型必选
 * @param value - 选中的类型
 * @returns 校验错误文案，通过时为 undefined
 */
function validateSecretType(value: string | number | undefined): string | undefined {
  return value == null || value === '' ? '请选择类型' : undefined
}

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
 * @description 创建时以明文走 stringData，由 Kubernetes 编码后写入 data
 * @returns 创建请求对象
 */
function buildFormData(): Partial<SecretCreateForm> {
  return {
    namespace: formData.namespace,
    name: formData.name,
    type: formData.type as SecretType,
    description: formData.description || undefined,
    immutable: formData.immutable,
    stringData: keyValueItemsToRecord(dataItems.value),
    labels: keyValueItemsToRecord(labelItems.value),
    annotations: keyValueItemsToRecord(annotationItems.value),
  }
}

/**
 * 提交创建
 * @description 先聚合校验表单，失败时提示并聚焦首个错误字段；成功后返回密钥列表
 */
async function handleSubmit() {
  const result = formRef.value?.validate()
  if (result && !result.valid) {
    BeeMessage.error(result.firstError ?? '请检查表单填写')
    return
  }
  isSubmitting.value = true
  try {
    await createSecret(clusterUid.value, buildFormData())
  } catch {
    BeeMessage.error('创建密钥失败')
    return
  } finally {
    isSubmitting.value = false
  }
  BeeMessage.success('创建成功')
  await router.push({ name: KubernetesRouteNames.Secret.List, params: { clusterUid: clusterUid.value } })
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
