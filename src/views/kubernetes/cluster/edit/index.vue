<template>
  <BeePage>
    <!-- 页面 Header -->
    <BeeBackHeader :actions="actionItems" title="编辑集群" @action="handleHeaderActions" @back="handleBack" />

    <!-- 表单 Body -->
    <BeeCard class="edit-body">
      <BeeForm ref="formRef" class="edit-basic">
        <BeeFieldInput id="uid" v-model="basicData.uid" disabled icon="basic-id" label="UID" />
        <BeeFieldInput id="name" v-model="basicData.name" disabled icon="basic-field-name" label="名称 / Name" />
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
      </BeeForm>
    </BeeCard>
  </BeePage>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'

import { useRoute, useRouter } from 'vue-router'

import type { ClusterDetailVo, ClusterUpdateForm } from '@/types/kubernetes/cluster'

import { getClusterDetail, updateCluster } from '@/api/kubernetes/cluster'

import { KubernetesRouteNames } from '@/router/names.ts'

import BeeFieldInput from '@/components/base/BeeFieldInput/index.vue'
import BeeFieldTextarea from '@/components/base/BeeFieldTextarea/index.vue'
import BeeForm from '@/components/base/BeeForm/index.vue'
import { BeeMessage } from '@/components/base/BeeMessage'
import BeeBackHeader, { type ActionItem } from '@/components/business/BeeBackHeader/index.vue'
import BeeCard from '@/components/layout/BeeCard/index.vue'
import BeePage from '@/components/layout/BeePage/index.vue'

import { useValidator } from '../composables/useValidator'

defineOptions({ name: 'ClusterEdit' })

const route = useRoute()
const router = useRouter()
const { validateDescription } = useValidator()

// ==================== Reactive State ====================
/** 表单实例，提交按钮在本组件之外，通过 ref 调用校验 */
const formRef = ref<InstanceType<typeof BeeForm>>()
/** 只读基本信息：仅用于展示，不参与提交 */
const basicData = reactive<Pick<ClusterDetailVo, 'uid' | 'name'>>({ uid: '', name: '' })
/** 可编辑表单数据 */
const formData = reactive<Required<ClusterUpdateForm>>({ description: '' })
/** 是否正在加载详情 */
const isLoading = ref<boolean>(false)
/** 是否正在提交 */
const isSubmitting = ref<boolean>(false)

// ==================== Computed ====================
/** 被编辑集群的 UID（路由参数） */
const clusterUid = computed(() => route.params.uid as string)
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
 * 获取集群详情并回填表单
 */
async function fetchClusterDetail() {
  isLoading.value = true
  try {
    const detail = await getClusterDetail(clusterUid.value)
    basicData.uid = detail.uid
    basicData.name = detail.name
    formData.description = detail.description ?? ''
  } catch {
    BeeMessage.error('加载集群详情失败')
    router.back()
  } finally {
    isLoading.value = false
  }
}

/**
 * 提交集群数据
 * @description 先聚合校验表单，失败时提示并聚焦首个错误字段；成功后返回集群列表
 */
async function handleSubmit() {
  const result = formRef.value?.validate()
  if (result && !result.valid) {
    BeeMessage.error(result.firstError ?? '请检查表单填写')
    return
  }
  isSubmitting.value = true
  try {
    await updateCluster(clusterUid.value, { description: formData.description })
  } catch {
    BeeMessage.error('保存集群失败')
    return
  } finally {
    isSubmitting.value = false
  }
  BeeMessage.success('保存成功')
  await router.push({ name: KubernetesRouteNames.Cluster.List })
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
  void fetchClusterDetail()
})
</script>

<style lang="scss" scoped>
.edit-body {
  display: flex;
  gap: 16px;
  flex-direction: column;
  flex: 1;
  padding: 16px;
  overflow: hidden auto;

  .edit-basic {
    display: grid;
    gap: 24px;
    grid-template-columns: 1fr 1fr;

    > .grid-line {
      grid-column: 1 / 3;
    }
  }
}
</style>
