<template>
  <BeePage>
    <!-- 页面 Header -->
    <BeeBackHeader :actions="actionItems" title="创建命名空间" @action="handleHeaderActions" @back="handleBack" />

    <!-- 表单 Body -->
    <BeeCard class="page-body">
      <BeeForm ref="formRef" class="page-form">
        <BeeFieldInput id="clusterUid" v-model="clusterUidText" disabled icon="kubernetes-cluster" label="所属集群" />
        <BeeFieldInput
          id="name"
          v-model="formData.name"
          icon="kubernetes-namespace"
          label="名称 / Name"
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
          :rows="5"
          tip="描述长度不能超过 255 个字符"
          :validator="validateDescription"
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
import { computed, reactive, ref } from 'vue'

import { useRoute, useRouter } from 'vue-router'

import type { NamespaceCreateForm } from '@/types/kubernetes/namespace'

import { createNamespace } from '@/api/kubernetes/namespace/namespace'

import { KubernetesRouteNames } from '@/router/names.ts'

import BeeFieldInput from '@/components/base/BeeFieldInput/index.vue'
import BeeFieldTextarea from '@/components/base/BeeFieldTextarea/index.vue'
import BeeForm from '@/components/base/BeeForm/index.vue'
import { BeeMessage } from '@/components/base/BeeMessage'
import BeeBackHeader, { type ActionItem } from '@/components/business/BeeBackHeader/index.vue'
import BeeKeyValueEditor from '@/components/business/BeeKeyValueEditor/index.vue'
import { keyValueItemsToRecord, type KeyValueItem } from '@/components/business/BeeKeyValueEditor/types'
import BeeCard from '@/components/layout/BeeCard/index.vue'
import BeePage from '@/components/layout/BeePage/index.vue'

import { useMetadataValidator } from '@/composables/useMetadataValidator'

import { useValidator } from '../composables/useValidator'

defineOptions({ name: 'NamespaceCreate' })

const route = useRoute()
const router = useRouter()
const { validateName, validateDescription } = useValidator()
const { validateMetadataKey, validateLabelValue } = useMetadataValidator()

// ==================== Reactive State ====================
/** 表单实例，提交按钮在本组件之外，通过 ref 调用校验 */
const formRef = ref<InstanceType<typeof BeeForm>>()
/** 表单数据 */
const formData = reactive<{ name: string; description: string }>({ name: '', description: '' })
/** 标签条目 */
const labelItems = ref<KeyValueItem[]>([])
/** 注解条目 */
const annotationItems = ref<KeyValueItem[]>([])
/** 是否正在提交 */
const isSubmitting = ref<boolean>(false)

// ==================== Computed ====================
/** 所属集群 UID（路由参数） */
const clusterUid = computed(() => route.params.clusterUid as string)
/** 所属集群只读展示值 */
const clusterUidText = ref(clusterUid.value)
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
 * 构建创建请求数据
 * @returns 创建请求对象
 */
function buildFormData(): Partial<NamespaceCreateForm> {
  return {
    name: formData.name,
    description: formData.description || undefined,
    labels: keyValueItemsToRecord(labelItems.value),
    annotations: keyValueItemsToRecord(annotationItems.value),
  }
}

/**
 * 提交创建
 * @description 先聚合校验表单，失败时提示并聚焦首个错误字段；成功后返回命名空间列表
 */
async function handleSubmit() {
  const result = formRef.value?.validate()
  if (result && !result.valid) {
    BeeMessage.error(result.firstError ?? '请检查表单填写')
    return
  }
  isSubmitting.value = true
  try {
    await createNamespace(clusterUid.value, buildFormData())
  } catch {
    BeeMessage.error('创建命名空间失败')
    return
  } finally {
    isSubmitting.value = false
  }
  BeeMessage.success('创建成功')
  await router.push({ name: KubernetesRouteNames.Namespace.List, params: { clusterUid: clusterUid.value } })
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
