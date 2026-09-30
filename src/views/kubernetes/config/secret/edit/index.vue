<template>
  <BeePage>
    <!-- 页面 Header -->
    <BeeBackHeader :actions="actionItems" title="编辑密钥" @action="handleHeaderActions" @back="handleBack" />

    <!-- 表单 Body -->
    <BeeCard class="page-body">
      <BeeForm ref="formRef" class="page-form">
        <BeeFieldInput id="namespace" v-model="namespaceText" disabled icon="kubernetes-namespace" label="命名空间" />
        <BeeFieldInput id="name" v-model="resourceNameText" disabled icon="kubernetes-secret" label="名称" />
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
          tip="值已由 Base64 解码为明文，提交时重新编码写回 data（移除条目即删除对应键）；无法按 UTF-8 解码的值原样保留 Base64。"
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

import type { SecretUpdateForm } from '@/types/kubernetes/config/secret'

import { decodeBase64, encodeBase64 } from '@/utils/base64'

import { getSecretDetail, updateSecret } from '@/api/kubernetes/config/secret'

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
  recordToKeyValueItems,
  type KeyValueItem,
} from '@/components/business/BeeKeyValueEditor/types'
import BeeCard from '@/components/layout/BeeCard/index.vue'
import BeePage from '@/components/layout/BeePage/index.vue'

import { useMetadataValidator } from '@/composables/useMetadataValidator'
import { SECRET_TYPE_FORM_OPTIONS, type SecretType } from '@/config/kubernetes/config/secret'

import { useValidator } from '../../composables/useValidator'

defineOptions({ name: 'SecretEdit' })

const route = useRoute()
const router = useRouter()
const { validateDescription, validateDataKey } = useValidator()
const { validateMetadataKey, validateLabelValue } = useMetadataValidator()

// ==================== Reactive State ====================
/** 表单实例，提交按钮在本组件之外，通过 ref 调用校验 */
const formRef = ref<InstanceType<typeof BeeForm>>()
/** 表单数据（type 用 string 声明，避免下拉 v-model 与字面量联合类型的写入冲突，提交时再收窄） */
const formData = reactive<{ type: string; description: string; immutable: boolean }>({
  type: 'Opaque',
  description: '',
  immutable: false,
})
/** 数据条目：键为明文（非 UTF-8 内容原样为 Base64） */
const dataItems = ref<KeyValueItem[]>([])
/** 详情返回的原始 data（Base64），用于未改动的非 UTF-8 值原样回传 */
const originalData = ref<Record<string, string>>({})
/** 标签条目 */
const labelItems = ref<KeyValueItem[]>([])
/** 注解条目 */
const annotationItems = ref<KeyValueItem[]>([])
/** 是否正在加载详情 */
const isLoading = ref<boolean>(false)
/** 是否正在提交 */
const isSubmitting = ref<boolean>(false)

// ==================== Computed ====================
/** 所属集群 UID（路由参数） */
const clusterUid = computed(() => route.params.clusterUid as string)
/** 所属命名空间名称（路由参数） */
const namespaceName = computed(() => route.params.namespace as string)
/** 被编辑资源名称（路由参数） */
const resourceName = computed(() => route.params.name as string)
/** 命名空间只读展示值 */
const namespaceText = ref(namespaceName.value)
/** 资源名称只读展示值 */
const resourceNameText = ref(resourceName.value)
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
 * 校验密钥类型必选
 * @param value - 选中的类型
 * @returns 校验错误文案，通过时为 undefined
 */
function validateSecretType(value: string | number | undefined): string | undefined {
  return value == null || value === '' ? '请选择类型' : undefined
}

/**
 * 获取密钥详情并回填表单
 * @description `data` 中的值为 Base64，UTF-8 可解码的按明文展示；解码失败（二进制内容）的原样展示
 */
async function fetchDetail() {
  isLoading.value = true
  try {
    const detail = await getSecretDetail(clusterUid.value, namespaceName.value, resourceName.value)
    formData.type = detail.type ?? 'Opaque'
    formData.description = detail.description ?? ''
    formData.immutable = detail.immutable ?? false
    originalData.value = detail.data ?? {}
    dataItems.value = Object.entries(originalData.value).map(([key, base64]) => ({
      key,
      value: decodeBase64(base64) ?? base64,
    }))
    labelItems.value = recordToKeyValueItems(detail.labels)
    annotationItems.value = recordToKeyValueItems(detail.annotations)
  } catch {
    BeeMessage.error('加载密钥详情失败')
    router.back()
  } finally {
    isLoading.value = false
  }
}

/**
 * 构建 data 记录
 * @description 展示值等于原始 Base64（说明该值非 UTF-8 且未改动）时原样回传，避免二次编码破坏内容；
 * 其余值按明文重新编码。整体为全量覆盖语义，移除的条目即被删除
 * @returns Base64 形式的 data 记录
 */
function buildDataRecord(): Record<string, string> {
  const record: Record<string, string> = {}
  for (const item of dataItems.value) {
    if (isBlankKeyValueItem(item)) continue
    const original = originalData.value[item.key]
    record[item.key] = original !== undefined && original === item.value ? original : encodeBase64(item.value)
  }
  return record
}

/**
 * 提交更新
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
    const payload: Partial<SecretUpdateForm> = {
      type: formData.type as SecretType,
      description: formData.description || undefined,
      immutable: formData.immutable,
      data: buildDataRecord(),
      labels: keyValueItemsToRecord(labelItems.value),
      annotations: keyValueItemsToRecord(annotationItems.value),
    }
    await updateSecret(clusterUid.value, namespaceName.value, resourceName.value, payload)
  } catch {
    BeeMessage.error('保存密钥失败')
    return
  } finally {
    isSubmitting.value = false
  }
  BeeMessage.success('保存成功')
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
  void fetchDetail()
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
