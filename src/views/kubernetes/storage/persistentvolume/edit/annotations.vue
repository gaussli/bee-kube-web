<template>
  <BeePage>
    <!-- 页面 Header -->
    <BeeBackHeader :actions="actionItems" title="配置注解" @action="handleHeaderActions" @back="handleBack" />

    <!-- 表单 Body -->
    <BeeCard class="page-body">
      <BeeForm ref="formRef" class="page-form">
        <BeeFieldInput id="name" v-model="resourceNameText" disabled icon="kubernetes-persistent-volume" label="名称" />
        <BeeKeyValueEditor
          v-model="annotationItems"
          icon="kubernetes-annotation"
          :key-validator="validateMetadataKey"
          label="注解"
          tip="注解键最长 253 个字符（可带 DNS 子域名前缀），注解值不限长度；提交后将以当前内容全量覆盖现有注解。"
        />
      </BeeForm>
    </BeeCard>
  </BeePage>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import { useRoute, useRouter } from 'vue-router'

import { getPersistentVolumeDetail, managePersistentVolumeAnnotations } from '@/api/kubernetes/storage/persistentvolume'

import { KubernetesRouteNames } from '@/router/names.ts'

import BeeFieldInput from '@/components/base/BeeFieldInput/index.vue'
import BeeForm from '@/components/base/BeeForm/index.vue'
import { BeeMessage } from '@/components/base/BeeMessage'
import BeeBackHeader, { type ActionItem } from '@/components/business/BeeBackHeader/index.vue'
import BeeKeyValueEditor from '@/components/business/BeeKeyValueEditor/index.vue'
import {
  keyValueItemsToRecord,
  recordToKeyValueItems,
  type KeyValueItem,
} from '@/components/business/BeeKeyValueEditor/types'
import BeeCard from '@/components/layout/BeeCard/index.vue'
import BeePage from '@/components/layout/BeePage/index.vue'

import { useMetadataValidator } from '@/composables/useMetadataValidator'
import { METADATA_OPERATION } from '@/config/kubernetes/core'

defineOptions({ name: 'PersistentVolumeManageAnnotations' })

const route = useRoute()
const router = useRouter()
const { validateMetadataKey } = useMetadataValidator()

// ==================== Reactive State ====================
/** 表单实例，提交按钮在本组件之外，通过 ref 调用校验 */
const formRef = ref<InstanceType<typeof BeeForm>>()
/** 注解条目 */
const annotationItems = ref<KeyValueItem[]>([])
/** 是否正在加载详情 */
const isLoading = ref<boolean>(false)
/** 是否正在提交 */
const isSubmitting = ref<boolean>(false)

// ==================== Computed ====================
/** 所属集群 UID（路由参数） */
const clusterUid = computed(() => route.params.clusterUid as string)
/** 被配置资源名称（路由参数） */
const resourceName = computed(() => route.params.name as string)
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
 * 获取持久卷详情并回填注解
 */
async function fetchAnnotations() {
  isLoading.value = true
  try {
    const detail = await getPersistentVolumeDetail(clusterUid.value, resourceName.value)
    annotationItems.value = recordToKeyValueItems(detail.annotations)
  } catch {
    BeeMessage.error('加载持久卷注解失败')
    router.back()
  } finally {
    isLoading.value = false
  }
}

/**
 * 提交注解配置
 * @description 先聚合校验表单，失败时提示并聚焦首个错误字段；成功后返回列表
 */
async function handleSubmit() {
  const result = formRef.value?.validate()
  if (result && !result.valid) {
    BeeMessage.error(result.firstError ?? '请检查表单填写')
    return
  }
  isSubmitting.value = true
  try {
    await managePersistentVolumeAnnotations(clusterUid.value, resourceName.value, {
      annotations: keyValueItemsToRecord(annotationItems.value),
      operation: METADATA_OPERATION.Replace,
    })
  } catch {
    BeeMessage.error('配置持久卷注解失败')
    return
  } finally {
    isSubmitting.value = false
  }
  BeeMessage.success('配置成功')
  await router.push({ name: KubernetesRouteNames.PersistentVolume.List, params: { clusterUid: clusterUid.value } })
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
  void fetchAnnotations()
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
    display: flex;
    gap: 24px;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
  }
}
</style>
